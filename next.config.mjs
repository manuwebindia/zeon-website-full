/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    qualities: [100, 75, 70],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'gsap',
      '@mui/material',
      '@mui/icons-material',
      '@tabler/icons-react',
      'lucide-react',
      'react-icons',
    ],
    cpus: 1,
  },
  // allowedDevOrigins: ["192.168.29.152", "localhosts"],
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
