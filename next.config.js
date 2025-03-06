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
          pathname: '/v0/b/zyysk8club-62059.appspot.com/o/',
        },
      ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://zyysk8club.web.app"
  },
}

module.exports = nextConfig