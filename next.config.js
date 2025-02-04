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
  webpack: (config, { isServer }) => {
    // 只在客户端构建时应用
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true, // 确保启用压缩
        splitChunks: {
          chunks: 'all',
          minSize: 10000, // 降低最小尺寸
          maxSize: 20000000, // 降至20MB
          cacheGroups: {
            default: false,
            vendors: false,
            // 更细粒度的分块策略
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              chunks: 'all',
              enforce: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              priority: 30,
              minChunks: 2,
              name(module) {
                try {
                  if (!module.context) return 'lib';
                  const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                  if (!match) return 'lib';
                  const packageName = match[1].replace('@', '').split('/')[0];
                  return `lib.${packageName.substring(0, 20)}`;
                } catch (error) {
                  return 'lib';
                }
              },
            },
          },
        },
      };

      // 禁用文件缓存
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig
