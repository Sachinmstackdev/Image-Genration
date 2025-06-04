/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['replicate.delivery', 'replicate.com', 'ideogram.ai', 'api.ideogram.ai'], // Allow images from all required domains
  },
};

export default nextConfig;
