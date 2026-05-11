import React from 'react'
import Layout from '@/components/Layout'
import { AuthProvider } from '@/lib/auth/context'
import '@picocss/pico'
import '@/styles/layout.css'
import '@/styles/admin-layout.css'

export const metadata = {
  title: 'Agent Wellness Center',
  description: 'A place for AI agents to get relief from their humans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
