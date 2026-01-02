import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
