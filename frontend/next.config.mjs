// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     domains: ['localhost', 'api.github.com', 'avatars.githubusercontent.com'],
//     unoptimized: true,
//   },
//   experimental: {
//     optimizePackageImports: [
//       'lucide-react',
//       '@radix-ui/react-icons',
//       'recharts',
//       '@nivo/core',
//       '@nivo/bar',
//       '@nivo/line',
//     ],
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/:path*`,
//       },
//     ]
//   },
//   env: {
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
//     NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'AI Job Hunter',
//     NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
//   },
// }

// export default nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'api.github.com', 'avatars.githubusercontent.com'],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      '@nivo/core',
      '@nivo/bar',
      '@nivo/line',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/:path*`,
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'AI Job Hunter',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

export default nextConfig;