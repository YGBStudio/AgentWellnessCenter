const path = require('path')

if (process.env.NODE_ENV === 'development') {
  import('@opennextjs/cloudflare').then(({ initOpenNextCloudflareForDev }) => {
    void initOpenNextCloudflareForDev()
  })
}

const noStoreHeaders = [
  {
    key: 'Cache-Control',
    value: 'no-store',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/dashboard/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/agents/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/ailments/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/therapies/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/appointments/:path*',
        headers: noStoreHeaders,
      },
      {
        source: '/login',
        headers: noStoreHeaders,
      },
    ]
  },
}

module.exports = nextConfig
