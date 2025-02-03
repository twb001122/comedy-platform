/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
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

    // 优化构建配置
    if (!isServer) {
      // 禁用持久化缓存
      config.cache = false;
      
      // 优化分包策略
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          '...',
          new (require('css-minimizer-webpack-plugin'))(),
        ],
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 20,
          maxAsyncRequests: 20,
          minSize: 40,
          maxSize: 1000 * 244, // 244KB
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