/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [100, 75, 70],
  },
  experimental: {
    optimizePackageImports: ['gsap'],
  },
  allowedDevOrigins: ["192.168.1.41", "localhost"],
};

export default nextConfig;
