import React from 'react'

export default function HeaderComponent() {
  return (
    <header className="app-header">
      <div className="header-actions">
        <a
          className="header-link"
          href="https://github.com/darshanmarathe/CodeCollab"
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-github"></i>
          GitHub
        </a>
      </div>
    </header>
  )
}
