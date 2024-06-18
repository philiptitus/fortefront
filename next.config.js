/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fortebyphil.pythonanywhere.com', // Proxy to Backend
      },
    ];
  },
}

module.exports = nextConfig;
