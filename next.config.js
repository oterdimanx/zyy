/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {typedRoutes: true},
  webpack(config) {
      config.experiments = { ...config.experiments, topLevelAwait: true };
      return config;
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    remotePatterns: [
      {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          port: '',
          pathname: process.env.FBS_PATHNAME,
        },
      ],
  },
}

module.exports = nextConfig