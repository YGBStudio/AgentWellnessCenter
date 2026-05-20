// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the YGBStudio credit link with a plain heart', () => {
    render(<Footer />)

    expect(screen.getByText(/Made with/i)).toBeInTheDocument()
    expect(screen.getByLabelText('love')).toHaveTextContent('❤️')
    expect(screen.getByRole('link', { name: 'YGBStudio' })).toHaveAttribute(
      'href',
      'https://ygbstudio.net/'
    )
  })
})
