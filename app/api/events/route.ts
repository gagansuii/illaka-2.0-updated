import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDatabaseErrorDetails } from '@/lib/database-errors';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { getOpenAIClient, getPineconeIndex, isOpenAIConfigured, isPineconeConfigured } from '@/lib/ai';
import { randomUUID } from 'crypto';

const createSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  bannerUrl: z.string().min(1),
  badgeIcon: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  capacity: z.number().int().min(1),
  isPaid: z.boolean()
}).refine((d) => new Date(d.endTime) > new Date(d.startTime), {
  message: 'endTime must be after startTime',
  path: ['endTime']
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const radius = Number(searchParams.get('radius') ?? 5000);

  if (!(await rateLimit(`events:${lat}:${lng}`))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ events: [] });
  }

  let events: any[];
  try {
    events = await prisma.$queryRaw<any[]>`
      SELECT
        "id",
        "title",
        "description",
        "bannerUrl",
        "badgeIcon",
        "latitude",
        "longitude",
        "startTime",
        "endTime",
        "visibility",
        "capacity",
        "organizerId",
        "isPaid",
        "engagementScore"
      FROM "Event"
      WHERE "visibility" = 'PUBLIC'
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          ${radius}
        )
      ORDER BY "engagementScore" DESC
      LIMIT 200
    `;
  } catch (err) {
    console.error('Events query failed:', err);
    const details = getDatabaseErrorDetails(err);
    return NextResponse.json({ error: details.message, events: [] }, { status: details.status });
  }

  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid payload' }, { status: 400 });

  const data = parsed.data;
  const eventId = randomUUID();
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  let inserted: any;
  try {
    inserted = await prisma.$queryRaw<any>`
      INSERT INTO "Event" (
        "id",
        "title",
        "description",
        "bannerUrl",
        "badgeIcon",
        "latitude",
        "longitude",
        "location",
        "startTime",
        "endTime",
        "visibility",
        "capacity",
        "organizerId",
        "isPaid",
        "engagementScore",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${eventId},
        ${data.title},
        ${data.description},
        ${data.bannerUrl},
        ${data.badgeIcon},
        ${data.latitude},
        ${data.longitude},
        ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)::geography,
        ${startTime},
        ${endTime},
        ${data.visibility}::"Visibility",
        ${data.capacity},
        ${session.user.id},
        ${data.isPaid},
        0,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING "id", "title", "description", "bannerUrl", "badgeIcon", "latitude", "longitude", "startTime", "endTime", "visibility", "capacity", "organizerId", "isPaid", "engagementScore", "createdAt", "updatedAt"
    `;
  } catch (err) {
    console.error('Event creation failed:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }

  const event = inserted[0];
  if (!event) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }

  // Best-effort: index in Pinecone for AI search. Failure here does not roll back the event.
  try {
    if (isOpenAIConfigured() && isPineconeConfigured()) {
      const openai = getOpenAIClient();
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `${event.title} - ${event.description}`
      });

      const index = getPineconeIndex();
      await index.upsert([
        {
          id: event.id,
          values: embedding.data[0].embedding,
          metadata: {
            latitude: event.latitude,
            longitude: event.longitude
          }
        }
      ]);
    }
  } catch (err) {
    console.error('Pinecone indexing failed for event', event.id, err);
  }

  return NextResponse.json({ event });
}
