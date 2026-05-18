// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BookingForm from './BookingForm'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('BookingForm', () => {
  it('shows a helpful empty state when booking prerequisites are unavailable', () => {
    render(<BookingForm agents={[]} ailments={[]} therapies={[]} />)

    expect(screen.getByRole('status')).toHaveTextContent(/missing agents, ailments, therapies/i)
    expect(screen.queryByRole('button', { name: /book appointment/i })).not.toBeInTheDocument()
  })
})
