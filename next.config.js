/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ant-design', 'antd'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-6b02f43cec584800b985e95cf7b4eef7.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xiaoleme.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.xiaoleme.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 