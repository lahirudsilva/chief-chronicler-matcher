/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@chronicler/types'],
  
  // Enable SCSS support
  sassOptions: {
    includePaths: ['./src/styles'],
    prependData: `@import "variables"; @import "mixins";`,
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://chronicler-backend.vercel.app'
      : 'http://localhost:3001'
  },
  
  // API proxy for development
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    return [
      {
        source: '/api/trpc/:path*',
        destination: 'http://localhost:3001/trpc/:path*',
      },
    ];
  },
};

module.exports = nextConfig;