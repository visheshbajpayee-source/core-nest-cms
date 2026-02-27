/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/employee/dashboard',
        destination: '/employee/dashboard',
      },
    ];
  },
};

module.exports = nextConfig;
