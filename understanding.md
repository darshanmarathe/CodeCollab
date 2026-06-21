# CodeCollab (Interview Pad)

**Purpose:** A real-time collaborative code editor for technical interviews. Multiple participants join a "room" to write code with syntax highlighting, chat, draw on a shared canvas, and share screens via WebRTC.

**Author:** Darshan Marathe | **License:** MIT | **Deployed at:** https://interviewpad.up.railway.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (CRA), Monaco Editor, Bootstrap 5 |
| Real-time | Socket.IO |
| WebRTC | PeerJS |
| Drawing | react-sketch-canvas |
| Chat | react-chat-widget |
| Backend | Express.js, Socket.IO, PeerJS server |
| Languages | JavaScript (ES6+), JSX, CSS |

---

## Directory Structure

```
CodeCollab/
├── .gitignore
├── CodeCollab.code-workspace       # VS Code workspace
├── DeployUIChanges.bat             # Build + deploy + git push
├── Dockerfile                      # Container definition (Node slim)
├── RunDev.bat                      # Launches client + dev servers
├── index.js / index.html / style.css  # Legacy placeholders
├── package.json                    # Root - starts server
├── todos.txt                       # Developer TODO list
│
├── client/                         # React frontend
│   ├── .env / .env.production      # Backend URL config
│   ├── package.json / yarn.lock
│   ├── public/
│   │   └── index.html              # Bootstrap + PeerJS CDN links
│   └── src/
│       ├── App.js                  # Root component: routing, state, layout
│       ├── App.css / index.css
│       ├── components/
│       │   ├── common.js           # 56 supported language identifiers
│       │   ├── Editor.jsx          # Monaco editor + Socket.IO + chat + selection sync
│       │   ├── Header.jsx          # Top navbar with GitHub link
│       │   ├── LanguagePicker.jsx   # Language dropdown selector
│       │   └── Sketch.jsx          # Drawing canvas with P2P sync
│       └── reportWebVitals.js / setupTests.js
│
└── server/                         # Express + Socket.IO backend
    ├── index.js                    # Server entry: HTTP, Socket.IO, PeerJS, room mgmt
    ├── package.json
    ├── common/
    │   ├── namesgenerator.js       # Docker-style random user names
    │   └── randomColor.js          # Random color generator (material, pastel, etc.)
    ├── public/                     # Built React app (copied from client/build)
    └── routes/index.js             # Empty placeholder
```

---

## Key Modules

### Server (`server/index.js`)
- Express server on port 3000, serves static React build
- Socket.IO for real-time events: `channel-join`, `coded`, `selection`, `drawn`, `message`
- PeerJS server at `/peerjs` for WebRTC screen sharing
- In-memory room management via `STATIC_CHANNELS` array
- Users get random names (Docker-style) and colors on join
- REST endpoint `GET /getChannels` returns active rooms
- Auto-cleanup empty rooms

### App (`client/src/App.js`)
- Generates random 8-char room code if none in URL
- Manages global state: code, language, theme, users, socket, sketch strokes
- Three tabs: **Code** (editor), **Screen** (screen share), **Sketch** (drawing)
- PeerJS screen sharing via `Share()` / `Watch()` functions

### Editor (`client/src/components/Editor.jsx`)
- Wraps `@monaco-editor/react` with full collaboration features
- Socket.IO connection lifecycle management
- Selection/cursor sync with colored overlays and name widgets per user
- Whole-text code sync (no OT/CRDT -- entire string broadcast on each change)
- Integrated chat widget via `react-chat-widget`
- Injects per-user CSS for selection highlighting

### Sketch (`client/src/components/Sketch.jsx`)
- Drawing board via `react-sketch-canvas`
- Toolbar: pencil, eraser, color picker, reset
- Syncs strokes to room via Socket.IO

### Name Generator (`server/common/namesgenerator.js`)
- Random scientist/engineer names (turing, hopper, einstein, etc.) - ~600 lines
- Ported from `github.com/shamrin/namesgenerator`

### Random Color (`server/common/randomColor.js`)
- Generates colors with palettes: pastel, material, dull, bright (default), gray, random
- Embeds full Material Design color palette

---

## Architecture Patterns

1. **Client-Server + WebSocket**: HTTP for static files, Socket.IO for real-time collaboration
2. **Room-based multi-user**: URL path segments are room IDs; state held in memory (no DB)
3. **Component-based React**: `App.js` lifts state up; mix of class (`Editor`) and functional components (`Sketch`, `Header`, `LanguagePicker`)
4. **Broadcast sync**: Full-text code and full-path sketch strokes broadcast on each change (optimistic local update + server relay). No CRDT/OT.
5. **Single-deployment**: React build copied into `server/public/`; Express serves everything on one port
6. **Anonymous access**: No auth -- anyone with the URL joins. Random names/colors reduce friction.

## Limitations / Design Trade-offs
- No persistence (data lost on server restart)
- Full-text sync can cause conflicts under concurrent edits
- No authentication
- Routes file is unused placeholder
