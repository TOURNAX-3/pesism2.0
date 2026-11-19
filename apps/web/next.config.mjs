/** @type {import('next').NextConfig} */
const nextConfig = {
  // @tournax/core ships TypeScript source, so Next compiles it.
  transpilePackages: ['@tournax/core'],
  // Share posters measure Furore with opentype.js — keep it on the Node server, not in the client bundle.
  serverExternalPackages: ['opentype.js', 'sharp'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Server Actions stay at 1MB default; large videos use /api/admin/match-highlight-upload.
  serverActions: {
    bodySizeLimit: '100mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    proxyClientMaxBodySize: '100mb',
  },
};

export default nextConfig;
