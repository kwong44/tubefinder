import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['tile.openstreetmap.org'],
  },
};

export default nextConfig;
