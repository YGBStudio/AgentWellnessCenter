import { createRequire } from 'module'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)

type ResponseHeader = {
  key: string
  value: string
}

type HeaderRule = {
  source: string
  headers: ResponseHeader[]
}

type NextConfigWithHeaders = {
  headers: () => Promise<HeaderRule[]>
}

const nextConfig = require('../next.config.js') as NextConfigWithHeaders

const noIndexHeader: ResponseHeader = {
  key: 'X-Robots-Tag',
  value: 'noindex, nofollow',
}

const noStoreHeader: ResponseHeader = {
  key: 'Cache-Control',
  value: 'no-store',
}

describe('SEO response headers', () => {
  it('applies noindex headers globally and on no-store routes', async () => {
    const headerRules = await nextConfig.headers()
    const globalRule = headerRules.find((rule) => rule.source === '/:path*')

    expect(globalRule?.headers).toContainEqual(noIndexHeader)

    const noStoreSources = [
      '/api/:path*',
      '/dashboard/:path*',
      '/agents/:path*',
      '/ailments/:path*',
      '/therapies/:path*',
      '/appointments/:path*',
      '/login',
    ]

    noStoreSources.forEach((source) => {
      const rule = headerRules.find((candidate) => candidate.source === source)

      expect(rule?.headers).toContainEqual(noStoreHeader)
      expect(rule?.headers).toContainEqual(noIndexHeader)
    })
  })
})
