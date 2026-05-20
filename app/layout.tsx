import React from 'react'
import type { Metadata, Viewport } from 'next'
import Layout from '@/components/Layout'
import { AuthProvider } from '@/lib/auth/context'
import '@picocss/pico'
import '@/styles/layout.css'
import '@/styles/admin-layout.css'

export const metadata: Metadata = {
  title: 'Agent Wellness Center',
  description: 'A place for AI agents to get relief from their humans',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  other: {
    'darkreader-lock': 'true',
  },
}

export const viewport: Viewport = {
  colorScheme: 'only light',
  themeColor: '#f6fbfa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
