/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.29.172:3000', '192.168.29.172'],
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
