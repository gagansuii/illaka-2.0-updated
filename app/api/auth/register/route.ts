import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const normalizedEmail = parsed.data.email.toLowerCase().trim();

  let existing;
  try {
    existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch (err) {
    console.error('Register lookup failed:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

  const password = await bcrypt.hash(parsed.data.password, 10);
  let user;
  try {
    user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        password
      }
    });
  } catch (err) {
    console.error('User creation failed:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ id: user.id });
}
