import './App.css';
import React, {  useState } from "react";
import LanguagePicker from './components/LanguagePicker';
import EditorWrapper from './components/Editor'
import supportedLanguages from './components/common'


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
  const [userCount, setuserCount] = useState(0)
  const [language, setLanguage] = useState('javascript')

  const meetingCode = window.location.pathname === "/" ? makeId(8) : window.location.pathname.replace("/", "");
  if (window.location.pathname === "/") {
    window.location.pathname = "/" + meetingCode
  }

  function onLanguageChange(lang) {

    const langua = supportedLanguages.find((x) => x.id === parseInt(lang))
    setLanguage(langua.name)

  }

  return (
    <>
      <input value={meetingCode} type="text" disabled="true" />
      <LanguagePicker value={language} onLanguageChange={(val) => onLanguageChange(val)} />
      Users:{userCount}
      <br />
      <div style={{ width: '100%', border: '1px solid red' }}>
        <EditorWrapper 
        language={language} 
        meetingCode={meetingCode} 
        code={code} 
        onUsersChanged={setuserCount}
        onLanguageChanged={setLanguage}/>
        <pre>
          {code}
        </pre>
      </div>
    </>
  );
}

export default App;
