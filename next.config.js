/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'replicate.delivery', // For Replicate-generated images
      'image.cdn2.seaart.me', // For demo images
    ],
  },
};

module.exports = nextConfig;
