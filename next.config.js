/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['*.cloudfront.net', 'i.zst.com.br', 'user-images.githubusercontent.com', 'cdn-demo.algolia.com', 'content-sit.api.news', 'i.imgur.com', 'www.wilko.com', 'res.cloudinary.com']
  }
}

module.exports = nextConfig
