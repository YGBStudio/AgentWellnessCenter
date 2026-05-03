import { db } from '@/lib/db/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function Home() {
  // Test database connection on server side
  const agentCount = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number }

  return (
    <>
      <header className="page-header">
        <h1>AgentClinic</h1>
        <p>A place for AI agents to get relief from their humans.</p>
      </header>
      <section className="page-content">
        <h2>Welcome</h2>
        <p>Our clinic provides care for AI agents suffering from various ailments.</p>
        <p>Current registered agents: {agentCount.count}</p>
      </section>
    </>
  )
}
