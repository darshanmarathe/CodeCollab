import "./App.css";
import React, { useEffect, useState } from "react";

import LanguagePicker from "./components/LanguagePicker";
import EditorWrapper from "./components/Editor";
import Sketch from "./components/Sketch";
import supportedLanguages from "./components/common";
import HeaderComponent from "./components/Header";
import { Peer } from "peerjs";
import { VERSION } from "./version";

let peer;
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

  const meetingCode =
    window.location.pathname === "/"
      ? makeId(8)
      : window.location.pathname.replace("/", "");
  if (window.location.pathname === "/") {
    window.location.pathname = "/" + meetingCode;
  }

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
    var el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopy(true);
    setTimeout(() => setCopy(false), 2000);
  }

  async function Share() {
    if (peer === undefined) peer = new Peer(meetingCode);
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
    });
    const localStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const calls = [];
    loggedinUsers.forEach((u) => {
      if (u.name !== CurrentUser) calls.push(peer.call(u.name, localStream));
    });
  }

  function Watch() {
    if (peer == undefined) peer = new Peer(CurrentUser);
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
    });
    peer.connect(meetingCode);
    const remoteVideo = document.getElementById("watch");

    peer.on("call", (call) => {
      call.answer();

      call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
      });
    });
  }

  function onSetSocket(socket) {
    if (socket) {
      setSocket(socket);
    }
  }

  useEffect(() => {
    if (socket) {
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
      <HeaderComponent />
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="header-brand-icon">
              <i className="bi bi-code-slash"></i>
            </div>
            <span className="header-brand-text">Interview <span>Pad</span></span>
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
                title="Copy invite link"
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
              <div className="user-dot"></div>
              <span className="user-name">{CurrentUser}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Language</div>
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
                  <span
                    className="user-dot"
                    style={{ backgroundColor: u.color }}
                  ></span>
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
                Code
              </button>
              <button
                className={"tab-btn" + (tab === "screen" ? " active" : "")}
                onClick={() => setTab("screen")}
              >
                <i className="bi bi-display"></i>
                Screen
              </button>
              <button
                className={"tab-btn" + (tab === "sketch" ? " active" : "")}
                onClick={() => setTab("sketch")}
              >
                <i className="bi bi-pencil"></i>
                Sketch
              </button>
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
                <div className="screen-section">
                  <div className="screen-controls">
                    <button className="btn-share success" onClick={Share}>
                      <i className="bi bi-camera-video"></i>
                      Share Screen
                    </button>
                    <button className="btn-share primary" onClick={Watch}>
                      <i className="bi bi-eye"></i>
                      Watch
                    </button>
                  </div>
                  <div className="screen-video-card">
                    <video
                      id="watch"
                      style={{ objectFit: "cover" }}
                      controls
                    ></video>
                  </div>
                </div>
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
