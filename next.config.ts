/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  basePath: '/contact-book',
  assetPrefix: '/contact-book/',
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig