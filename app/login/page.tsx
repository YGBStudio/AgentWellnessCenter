import React from 'react'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Login | Agent Wellness Center',
  description: 'Sign in to access the staff dashboard.',
}

export default function LoginPage() {
  return (
    <section className="container">
      <header className="page-header" style={{ textAlign: 'center' }}>
        <h1>Agent Wellness Center</h1>
        <p>Sign in to access the staff dashboard.</p>
      </header>

      <div style={{ maxWidth: '420px', margin: '0 auto' }}>
        <LoginForm />
      </div>
    </section>
  )
}