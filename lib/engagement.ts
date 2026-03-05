import { prisma } from '@/lib/prisma';

export async function recalcEngagementScore(eventId: string) {
  // Single atomic UPDATE so counts and the write all happen in one statement.
  // Previously four separate COUNT queries ran then a separate UPDATE, meaning
  // counts could change between reads and the stored value would be stale.
  await prisma.$executeRaw`
    UPDATE "Event"
    SET "engagementScore" = (
      (SELECT COUNT(*) FROM "RSVP"       WHERE "eventId" = ${eventId}) * 3 +
      (SELECT COUNT(*) FROM "Like"       WHERE "eventId" = ${eventId}) * 1 +
      (SELECT COUNT(*) FROM "Share"      WHERE "eventId" = ${eventId}) * 5 +
      (SELECT COUNT(*) FROM "Attendance" WHERE "eventId" = ${eventId}) * 10
    )
    WHERE "id" = ${eventId}
  `;
}
