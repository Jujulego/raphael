import { prisma } from '@/lib/prisma.client';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  baseURL: {
    allowedHosts: ['localhost:3000', 'raphael-*-jujulego.vercel.app', 'raphael-iota.vercel.app'],
    protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [nextCookies()],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  advanced: {
    database: {
      joins: true,
    },
  },
});
