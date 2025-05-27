/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@chronicler/types'],
  
  // Enable SCSS support
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  
  // API proxy for development
  async rewrites() {
    return [
      {
        source: '/api/trpc/:path*',
        destination: 'http://localhost:3001/trpc/:path*',
      },
    ];
  },
};

module.exports = nextConfig;