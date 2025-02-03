/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: 'dist',
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
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // 禁用缓存
    if (!isServer) {
      config.cache = false;
    }

    // 优化分包策略
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        runtimeChunk: false,
        splitChunks: {
          cacheGroups: {
            default: false,
            vendors: false,
          },
        },
      };
    }
    
    return config;
  },
  generateBuildId: () => 'build',
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  cleanDistDir: true,
}

module.exports = nextConfig; 