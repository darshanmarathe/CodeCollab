# Interview Pad - Roadmap

## Current State (v1.2.0)
- Real-time collaborative code editor (Monaco)
- 56 programming languages
- Light/Dark theme
- Sketch canvas with sync
- Screen sharing (WebRTC/PeerJS)
- Chat widget
- Room-based collaboration with anonymous users

---

## Phase 1: Polish & Stability
*Short-term improvements*

- [ ] Add error boundaries for crash recovery
- [ ] Add loading states and skeleton screens
- [ ] Improve mobile responsiveness
- [ ] Add keyboard shortcuts (Ctrl+K for language, etc.)
- [ ] Add copy room link button in header
- [ ] Show connection status indicator
- [ ] Add "copied" toast notification
- [ ] Fix chat widget positioning on small screens
- [ ] Add favicon and proper meta tags

## Phase 2: User Experience
*Better collaboration features*

- [ ] Named rooms (e.g., `/room/my-interview`)
- [ ] User avatars (generated from initials)
- [ ] Cursor presence indicators
- [ ] Follow mode (sync scroll position)
- [ ] Code execution (run code in browser)
- [ ] File tree / multi-file support
- [ ] Undo/Redo sync
- [ ] Syntax error highlights shared

## Phase 3: Persistence & Auth
*Data and user management*

- [ ] MongoDB/PostgreSQL for room persistence
- [ ] Optional authentication (GitHub/Google OAuth)
- [ ] Save room history
- [ ] Export chat history
- [ ] Room password protection
- [ ] Host controls (mute users, kick)
- [ ] Room expiration (auto-cleanup)

## Phase 4: Advanced Features
*Power user capabilities*

- [ ] Whiteboard mode (persistent drawings)
- [ ] Video calls (WebRTC peer video)
- [ ] Audio calls
- [ ] Screen recording
- [ ] Code review mode (comments on lines)
- [ ] Terminal integration
- [ ] AI code suggestions (optional)
- [ ] Custom themes / editor settings sync

## Phase 5: Scale & Deploy
*Production readiness*

- [ ] Redis for multi-server support
- [ ] Rate limiting
- [ ] DDoS protection
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Docker optimization
- [ ] CI/CD pipeline
- [ ] Monitoring and alerts
- [ ] Load testing

---

## Tech Debt to Address
- [ ] Migrate Editor.jsx from class to functional component
- [ ] Add TypeScript
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Upgrade to Vite (replace CRA)
- [ ] Add ESLint + Prettier config
- [ ] Add commit hooks (Husky + lint-staged)
- [ ] Document API endpoints
- [ ] Add JSDoc to server functions
