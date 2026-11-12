/** @type {import('next').NextConfig} */
const nextConfig = {
  // @tournax/core ships TypeScript source, so Next compiles it.
  transpilePackages: ['@tournax/core'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
