/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn-demo.algolia.com', 'content-sit.api.news', 'i.imgur.com', 'www.wilko.com']
  }
}

module.exports = nextConfig
