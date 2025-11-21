/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'polymarket.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/markets/:path*',
        destination: 'http://localhost:3001/api/markets/:path*',
      },
    ];
  },
}

module.exports = nextConfig
