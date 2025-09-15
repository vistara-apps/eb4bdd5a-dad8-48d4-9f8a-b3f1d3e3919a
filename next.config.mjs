/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com', 'ipfs.io'],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
