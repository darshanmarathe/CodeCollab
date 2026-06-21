import React from 'react'

export default function HeaderComponent({ meetingCode, copied, onCopyLink }) {
  return (
    <header className="app-header">
      <div className="header-actions">
        <button
          className={"header-link" + (copied ? " copied" : "")}
          onClick={onCopyLink}
          title="Copy invite link"
        >
          <i className={"bi " + (copied ? "bi-check-lg" : "bi-link-45deg")}></i>
          {copied ? "Copied!" : "Invite"}
        </button>
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
