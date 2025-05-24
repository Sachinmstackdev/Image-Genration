/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['replicate.delivery', 'replicate.com'], // Allow images from both domains
  },
};

export default nextConfig;
