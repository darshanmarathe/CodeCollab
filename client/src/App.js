import "./App.css";
import React, { useEffect, useState } from "react";

import LanguagePicker from "./components/LanguagePicker";
import EditorWrapper from "./components/Editor";
import Sketch from "./components/Sketch";
import supportedLanguages from "./components/common";
import HeaderComponent from "./components/Header";
import { Peer } from "peerjs";

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
  const [copied, setCopy] = useState("bi-clipboard");
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
  }

  function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement("textarea");
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand("copy");
    // Remove temporary element
    document.body.removeChild(el);
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
      socket.on("drawn", (stroks) => {
        console.log("from app to be drawn", stroks);
        setStrocks(stroks);
      });
    }
  }, [socket]);

  return (
    <>
      <HeaderComponent />
      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
          >
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <div style={{ width: "100%" }}>
                    <a
                      href={"/" + meetingCode}
                      target="_blank"
                      className="nav-link"
                      aria-current="page"
                    >
                      {meetingCode}
                    </a>
                    <button
                      title="Copy to clipboard"
                      onClick={(e) => {
                        e.stopPropagation();
                        let url = window.location.href;
                        copyStringToClipboard(url);
                        setCopy("bi-clipboard-check");
                      }}
                      className={"bi " + copied}
                    ></button>
                    <br />
                    me : <b>{CurrentUser}</b>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link" href="#">
                    <LanguagePicker
                      value={language}
                      onLanguageChange={(val) => onLanguageChange(val)}
                    />
                  </div>
                </li>
                <li className="nav-item">
                  <span> Theme</span>
                  <select
                    className="form-select"
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value);
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </li>
                <li className="nav-item">
                  <div className="nav-link" href="#">
                    <span data-feather="shopping-cart"></span>
                    Users : <b> {loggedinUsers.length} </b>
                    <ul>
                      {loggedinUsers.map((u) => {
                        return (
                          <li
                            style={{
                              color: u.color,
                              backgroundColor: "black",
                              paddingLeft: "5px",
                            }}
                          >
                            {u.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
                {/* <li>
                    Backend
                    {REACT_APP_BACKEND}
                  </li> */}
                <li className="nav-item">
                  <a
                    target="_blank"
                    href="https://github.com/darshanmarathe"
                    className="nav-link"
                  >
                    <span data-feather="shopping-cart"></span>
                    Developed by :{" "}
                    <b>
                      Darshan Marathe!! <br />
                    </b>
                  </a>
                </li>

                <li>UI Version : 1.1.0</li>
                {/* <li>
                  Show chat
                  <input
                    type="checkbox"
                    value={showChat}
                    onChange={(e) => setShowChat(!showChat)}
                  />
                </li> */}
              </ul>
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                  onClick={() => {
                    console.log(code);
                    setTab("code");
                  }}
                >
                  Code
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                  onClick={() => setTab("screen")}
                >
                  Screen
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  onClick={() => setTab("sketch")}
                >
                  Sketch
                </button>
              </li>
            </ul>

            <div
              className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
              id="codeCont"
            >
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  {tab === "code" && (
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
                        console.log(code);
                      }}
                      onUserConnect={(name) => {
                        if (CurrentUser === "NA") {
                          setCurrentUser(name);
                        }
                      }}
                      socket={socket}
                      onSetSocket={onSetSocket}
                      onUsersChanged={setUsersChange}
                      onLanguageChanged={setLanguage}
                    />
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  {tab === "screen" && (
                    <div>
                      <button className="btn btn-success" onClick={Share}>
                        Share
                      </button>
                      <button className="btn btn-primary" onClick={Watch}>
                        Watch
                      </button>

                      <video
                        id="watch"
                        width="1000"
                        style={{ objectFit: "cover" }}
                        height="500"
                        controls
                      ></video>
                    </div>
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                >
                  {tab === "sketch" && (
                    <Sketch
                      onStroked={(e) => {
                        console.log(e , "from strocks00");
                        setStrocks(e)
                      }}
                      socket={socket}
                      strocks={strocks}
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  ); 
}

export default App;
