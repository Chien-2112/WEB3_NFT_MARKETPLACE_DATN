/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      electron: false, // chặn lỗi require('electron')
    };
    return config;
  },

  images: {
    domains: ['ipfs.infura.io', 'nftstorage.link', 'gateway.pinata.cloud'],
  },
};

export default nextConfig;
