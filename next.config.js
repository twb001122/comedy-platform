/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'xiaoleme.com', 'www.xiaoleme.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.netlify.app',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'comedy-platform.netlify.app',
        port: '',
        pathname: '/uploads/**',
      }
    ],
  },
  compress: true,
  // 禁用 webpack 缓存
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
}

module.exports = nextConfig
