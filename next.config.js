/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/prostate-biopsy-report',
  assetPrefix: '/prostate-biopsy-report/',
}

module.exports = nextConfig