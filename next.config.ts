/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  basePath: '/contact-book',
  assetPrefix: '/contact-book/',
  // Remova ou comente a linha abaixo:
  // experimental: {
  //   optimizeCss: true,
  // },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig