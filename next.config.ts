import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
