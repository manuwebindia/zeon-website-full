/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    qualities: [100, 75, 70],
  },
  experimental: {
    optimizePackageImports: ['gsap'],
  },
  allowedDevOrigins: ["192.168.1.41", "localhost"],
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
      {
        source: '/api/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
