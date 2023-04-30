import './App.css';
import React, { useState } from "react";
import LanguagePicker from './components/LanguagePicker';
import EditorWrapper from './components/Editor'
import supportedLanguages from './components/common'
import HeaderComponent from './components/Header'
const { REACT_APP_BACKEND } = process.env;



function App() {
  function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  const code = '// write code here...';
  
  const [loggedinUsers, setLoggedinUser] = useState([])
  const [language, setLanguage] = useState('javascript')
  const [CurrentUser , setCurrentUser] = useState('NA');
  const [copied, setCopy] = useState("bi-clipboard")
  
  const meetingCode = window.location.pathname === "/" ? makeId(8) : window.location.pathname.replace("/", "");
  if (window.location.pathname === "/") {
    window.location.pathname = "/" + meetingCode
  }

  function setUsersChange(users) {
    setLoggedinUser(users)
  }

  function onLanguageChange(lang) {

    const langua = supportedLanguages.find((x) => x.id === parseInt(lang))
    setLanguage(langua.name)

  }

  function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
  }

  return (
    <>
      <HeaderComponent />
      <div className="container-fluid">
        <div className="row">
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">

                  <div style={{ width: '100%' }}>
                    <a href={"/" + meetingCode} target="_blank" className="nav-link" aria-current="page">
                      {meetingCode}
                    </a>

                    <button title="Copy to clipboard" onClick={(e) => {
                      e.stopPropagation();
                      let url = window.location.href;
                      copyStringToClipboard(url)
                      setCopy("bi-clipboard-check")
                    }} className={"bi " + (copied)}></button>
                  <br/>
                  me : <b>{CurrentUser}</b>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link" href="#">
                    <LanguagePicker value={language} onLanguageChange={(val) => onLanguageChange(val)} />
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link" href="#">
                    <span data-feather="shopping-cart"></span>
                    Users : <b> {loggedinUsers.length} </b>
                    <ul>
                      {
                        loggedinUsers.map(u => {
                          return <li style={{ color: u.color, backgroundColor: 'black', paddingLeft: '5px' }}>{u.name}</li>
                        })
                      }
                    </ul>
                  </div>
                </li>
                  {/* <li>
                    Backend
                    {REACT_APP_BACKEND}
                  </li> */}
                <li className="nav-item">
                  <a target="_blank" href="https://github.com/darshanmarathe" className="nav-link">
                    <span data-feather="shopping-cart"></span>
                    Developed by : <b>
                      Darshan Marathe!! <br />
                     
                    </b>
                  </a>
                </li>
                <li>
                UI Version : 1.0.3
                </li>
              </ul>


            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

              <EditorWrapper
                language={language}
                meetingCode={meetingCode}
                code={code}
                onUserConnect={(name) => {
                  if(CurrentUser === 'NA' ){
                    setCurrentUser(name)
                  }
                }}
                onUsersChanged={setUsersChange}
                onLanguageChanged={setLanguage} />
            </div>
          </main>
        </div>

      </div>

    </>
  );
}

export default App;
