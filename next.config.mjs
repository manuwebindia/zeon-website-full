/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   optimized: true,
  // },
  experimental: {
    optimizePackageImports: ['gsap'],
  },
  allowedDevOrigins: ["192.168.1.38", "localhost"],
};

export default nextConfig;
