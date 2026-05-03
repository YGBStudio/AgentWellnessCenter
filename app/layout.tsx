import '@/styles/layout.css'
import Layout from '@/components/Layout'


export const metadata = {
  title: 'AgentClinic',
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
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
