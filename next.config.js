/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/intro',
        permanent: true,
        has: [
          {
            type: 'cookie',
            key: 'visited',
            value: undefined, // visited 쿠키가 없을 때만 리다이렉트
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 