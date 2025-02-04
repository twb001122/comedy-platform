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
  webpack: (config, { isServer }) => {
    // 只在客户端构建时应用
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 24000000, // 确保分块小于 25MB
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // 为大型依赖创建单独的块
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                try {
                  // 添加安全检查
                  if (!module || !module.context) {
                    return 'vendor';
                  }
                  
                  const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                  if (!match || !match[1]) {
                    return 'vendor';
                  }

                  const packageName = match[1];
                  // 限制文件名长度，避免可能的文件系统限制
                  return `vendor.${packageName.replace('@', '').split('/')[0].substring(0, 30)}`;
                } catch (error) {
                  console.warn('Error in vendor chunk naming:', error);
                  return 'vendor';
                }
              },
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig
