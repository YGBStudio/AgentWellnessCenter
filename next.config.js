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

const noIndexHeaders = [
  {
    key: 'X-Robots-Tag',
    value: 'noindex, nofollow',
  },
]

const noStoreNoIndexHeaders = [...noStoreHeaders, ...noIndexHeaders]

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: noIndexHeaders,
      },
      {
        source: '/api/:path*',
        headers: noStoreNoIndexHeaders,
      },
      {
        source: '/dashboard/:path*',
        headers: noStoreNoIndexHeaders,
      },
      {
        source: '/agents/:path*',
        headers: noStoreNoIndexHeaders,
      },
      {
        source: '/ailments/:path*',
        headers: noStoreNoIndexHeaders,
      },
      {
        source: '/therapies/:path*',
        headers: noStoreNoIndexHeaders,
      },
      {
        source: '/appointments/:path*',
        headers: noStoreNoIndexHeaders,
      },
      {
        source: '/login',
        headers: noStoreNoIndexHeaders,
      },
    ]
  },
}

module.exports = nextConfig
