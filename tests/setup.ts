import '@testing-library/jest-dom/vitest';
import { prisma } from '@/lib/prisma.client';
import type { PrismaClient } from '@/lib/prisma/client';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { mockReset } from 'vitest-mock-extended';

vi.mock('next/cache');

vi.mock('@/lib/prisma.client', async () => {
  const { mockDeep } = await import('vitest-mock-extended');

  return {
    prisma: mockDeep<PrismaClient>(),
  };
});

beforeEach(() => {
  mockReset(prisma);
});

afterEach(() => {
  cleanup();
});
