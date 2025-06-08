/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/intro',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 