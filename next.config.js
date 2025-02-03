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
    ],
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 