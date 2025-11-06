/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore electron module for browser builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        electron: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
