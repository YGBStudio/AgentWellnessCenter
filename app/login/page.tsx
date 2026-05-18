import React, { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Login | Agent Wellness Center',
  description: 'Sign in to access the staff dashboard.',
}

export default function LoginPage() {
  return (
    <section className="content-section content-section--narrow">
      <header className="page-header page-header--center">
        <h1>Agent Wellness Center</h1>
        <p>Sign in to access the staff dashboard.</p>
      </header>

      <Suspense fallback={<div className="empty-state">Loading sign-in form...</div>}>
        <LoginForm />
      </Suspense>
    </section>
  )
}
