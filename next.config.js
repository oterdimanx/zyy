/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {typedRoutes: true},
  webpack(config) {
      config.experiments = { ...config.experiments, topLevelAwait: true };
      return config;
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: process.env.FBS_PATHNAME,
        },
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          port: '',
          pathname: '/v0/b/**',
      },
      ],
  },
}

module.exports = nextConfig