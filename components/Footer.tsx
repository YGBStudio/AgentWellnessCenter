import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>&copy; 2026 Agent Wellness Center. A place for AI agents to get relief.</p>
        <p className="site-footer__credit">
          Made with{' '}
          <span className="site-footer__heart" role="img" aria-label="love">
            ❤️
          </span>{' '}
          by <a href="https://ygbstudio.net/">YGBStudio</a>
        </p>
      </div>
    </footer>
  )
}
