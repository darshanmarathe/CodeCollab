import "./App.css";
import React, { useEffect, useState, useCallback } from "react";

import LanguagePicker from "./components/LanguagePicker";
import EditorWrapper from "./components/Editor";
import Sketch from "./components/Sketch";
import ScreenShare from "./components/ScreenShare";
import CodeRunner from "./components/CodeRunner";
import Avatar from "./components/Avatar";
import supportedLanguages from "./components/common";
import HeaderComponent from "./components/Header";
import ConnectionStatus from "./components/ConnectionStatus";
import Toast from "./components/Toast";
import { VERSION } from "./version";

function App() {
  function makeId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function getRoomFromPath() {
    const path = window.location.pathname;
    if (path === "/") return null;
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    const room = segments[segments.length - 1];
    return room || null;
  }

  const [code, setCode] = useState("// write code here...");
  const [decorations, setDecoration] = useState({});
  const [strocks, setStrocks] = useState({ paths: [] });

  const [loggedinUsers, setLoggedinUser] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [CurrentUser, setCurrentUser] = useState("NA");
  const [copied, setCopy] = useState(false);
  const [theme, setTheme] = useState("light");
  const [tab, setTab] = useState("code");
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const existingRoom = getRoomFromPath();
  const meetingCode = existingRoom || makeId(8);
  if (!existingRoom) {
    window.history.replaceState(null, "", "/" + meetingCode);
  }

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  function setUsersChange(users) {
    setLoggedinUser(users);
  }

  function onLanguageChange(lang) {
    const langua = supportedLanguages.find((x) => x.id === parseInt(lang));
    setLanguage(langua.name);
    if (socket) {
      socket.emit("language-changed", {
        meetingCode,
        language: langua.name,
      });
    }
  }

  function copyStringToClipboard(str) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str).then(() => {
        setCopy(true);
        addToast("Link copied to clipboard");
        setTimeout(() => setCopy(false), 2000);
      });
    } else {
      var el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopy(true);
      addToast("Link copied to clipboard");
      setTimeout(() => setCopy(false), 2000);
    }
  }

  function onSetSocket(sock) {
    if (sock) {
      setSocket(sock);
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const langSelect = document.querySelector(".sidebar-select");
        if (langSelect) langSelect.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        copyStringToClipboard(window.location.href);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        setTab("code");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "2") {
        e.preventDefault();
        setTab("screen");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "3") {
        e.preventDefault();
        setTab("sketch");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setConnectionStatus("connected");
      });

      socket.on("disconnect", () => {
        setConnectionStatus("disconnected");
      });

      socket.on("reconnect_attempt", () => {
        setConnectionStatus("connecting");
      });

      socket.on("reconnect", () => {
        setConnectionStatus("connected");
      });

      socket.on("drawn", (stroks, _meetingCode) => {
        console.log("from app to be drawn", stroks);
        if (meetingCode === _meetingCode) setStrocks(stroks);
      });

      socket.on("channel", (chan) => {
        console.log("channel strokes App.js", chan);
        if (chan.name === meetingCode) {
          setStrocks(chan.strokes);
        }
      });
    }
  }, [socket]);

  return (
    <>
      <HeaderComponent
        meetingCode={meetingCode}
        copied={copied}
        onCopyLink={() => copyStringToClipboard(window.location.href)}
      />

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <i className={"bi " + (sidebarOpen ? "bi-x-lg" : "bi-list")}></i>
      </button>

      <div className="app-layout">
        <aside className={"sidebar" + (sidebarOpen ? " open" : "")}>
          <div className="sidebar-brand">
            <div className="header-brand-icon">
              <i className="bi bi-code-slash"></i>
            </div>
            <span className="header-brand-text">Interview <span>Pad</span></span>
          </div>

          <div className="sidebar-section">
            <ConnectionStatus status={connectionStatus} />
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Room</div>
            <div className="meeting-code-card">
              <a
                href={"/" + meetingCode}
                target="_blank"
                rel="noreferrer"
                className="meeting-code-text"
              >
                {meetingCode}
              </a>
              <button
                title="Copy invite link (Ctrl+Shift+C)"
                onClick={(e) => {
                  e.stopPropagation();
                  copyStringToClipboard(window.location.href);
                }}
                className={"copy-btn" + (copied ? " copied" : "")}
              >
                <i className={"bi " + (copied ? "bi-check-lg" : "bi-clipboard")}></i>
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="current-user">
              <Avatar name={CurrentUser} size={28} />
              <span className="user-name">{CurrentUser}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">
              Language
              <span className="sidebar-hint">Ctrl+K</span>
            </div>
            <LanguagePicker
              value={language}
              onLanguageChange={(val) => onLanguageChange(val)}
            />
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Theme</div>
            <select
              className="sidebar-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">
              Collaborators
              <span className="badge">{loggedinUsers.length}</span>
            </div>
            <ul className="users-list">
              {loggedinUsers.map((u) => (
                <li key={u.userId || u.name} className="user-badge">
                  <Avatar name={u.name} color={u.color} size={24} />
                  <span className="user-name">{u.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-footer">
            <a
              href="https://github.com/darshanmarathe"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-person-circle"></i>
              Darshan Marathe
            </a>
            <div className="sidebar-version">UI v{VERSION}</div>
          </div>
        </aside>

        <div className="main-content">
          <div className="container-fluid">
            <div className="tab-bar">
              <button
                className={"tab-btn" + (tab === "code" ? " active" : "")}
                onClick={() => setTab("code")}
              >
                <i className="bi bi-code-slash"></i>
                <span className="tab-label">Code</span>
                <span className="tab-shortcut">1</span>
              </button>
              <button
                className={"tab-btn" + (tab === "screen" ? " active" : "")}
                onClick={() => setTab("screen")}
              >
                <i className="bi bi-display"></i>
                <span className="tab-label">Screen</span>
                <span className="tab-shortcut">2</span>
              </button>
              <button
                className={"tab-btn" + (tab === "sketch" ? " active" : "")}
                onClick={() => setTab("sketch")}
              >
                <i className="bi bi-pencil"></i>
                <span className="tab-label">Sketch</span>
                <span className="tab-shortcut">3</span>
              </button>

              <div className="tab-spacer"></div>

              {tab === "code" && (
                <CodeRunner code={code} language={language} />
              )}
            </div>

            <div className="content-area">
              {tab === "code" && (
                <div className="editor-container">
                  <EditorWrapper
                    language={language}
                    meetingCode={meetingCode}
                    code={code}
                    theme={theme}
                    user={CurrentUser}
                    decorations={decorations}
                    setCode={(t) => {
                      setCode(t.text);
                      setDecoration(t.decorations);
                    }}
                    onUserConnect={(name) => {
                      if (CurrentUser === "NA") {
                        setCurrentUser(name);
                      }
                    }}
                    setStrocks={(strokes) => {
                      if (strokes) {
                        setStrocks(strokes);
                      }
                    }}
                    socket={socket}
                    onSetSocket={onSetSocket}
                    onUsersChanged={setUsersChange}
                    onLanguageChanged={setLanguage}
                  />
                </div>
              )}

              {tab === "screen" && (
                <ScreenShare
                  meetingCode={meetingCode}
                  loggedinUsers={loggedinUsers}
                  currentUser={CurrentUser}
                />
              )}

              {tab === "sketch" && (
                <div className="sketch-section">
                  <Sketch
                    onStroked={(e) => {
                      setStrocks(e);
                    }}
                    socket={socket}
                    strocks={strocks}
                    meetingCode={meetingCode}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
