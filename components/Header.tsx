import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <h1>AgentClinic</h1>
      <nav>
        <Link href="/">Home</Link>
      </nav>
    </header>
  )
}
