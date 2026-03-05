import { PrismaClient } from '@prisma/client';

import { getEnv } from './config';

// ensure the important environment variable is present before we try to connect
getEnv('DATABASE_URL');

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
