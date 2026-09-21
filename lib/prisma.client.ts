import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from './prisma/client';

export const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  }),
  log: process.env.NODE_ENV !== 'production' ? ['query', 'info', 'warn', 'error'] : undefined,
});
