/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        electron: false,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.externals.push({
      electron: 'commonjs electron',
    });

    return config;
  },

  images: {
    domains: ['ipfs.infura.io', 'nftstorage.link', 'gateway.pinata.cloud'],
  },
};

export default nextConfig;
