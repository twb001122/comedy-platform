/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['localhost'],
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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }
    // 优化代码分割策略
    config.optimization.splitChunks = {
      chunks: 'all',
      maxSize: 256000, // 单个 chunk 最大 250KB
      minSize: 20000,
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['antd']
  }
}

module.exports = nextConfig 