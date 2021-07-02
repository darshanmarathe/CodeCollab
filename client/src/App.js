import './App.css';
import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import LanguagePicker from './components/LanguagePicker';

import socketClient from "socket.io-client";
import supportedLanguages from './components/common' 
const SERVER = "http://localhost:3001";


function App() {
  const editorRef = useRef(null);
  var socket = socketClient(SERVER); 
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
  
  const [code, setCode] = useState('// write code here...')
  const [userCount, setuserCount] = useState(0)
  const [language, setLanguage] = useState('javascript')

  const meetingCode = window.location.pathname === "/" ? makeId(8) : window.location.pathname.replace("/" , "");
  if(window.location.pathname == "/"){
    window.location.pathname = "/" + meetingCode
  }
  

  useEffect(() => {
    
    console.log("useEffect called")
 
    socket.on('connection', () => {
      console.log('connected');
    });
    socket.on('channel', channel => {
        console.log('channel' , channel)
        setuserCount(channel.participants)
        setCode(channel.text);
    });
    socket.on('coded', message => {
      if(message.meetingCode === meetingCode)
            setCode(message.text);
    });
    socket.emit('channel-join', meetingCode, ack => {
      console.log('channel Joined' , ack)
    });
  }, []);


  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  function showValue() {
    const text = editorRef.current.getValue();
    setCode(text);
    console.log(socket , "socket")
    socket.emit('coded', { meetingCode, text});
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
        <Editor
          height="100vh"
          width="90vw"
          theme="vs-dark"
          style={{float : 'left'}}
          onChange={showValue}
          path={language}
          defaultLanguage={language}
          value={code}
          //defaultValue={code}
          onMount={handleEditorDidMount}
        />
        <pre>
        {code}
        </pre>
      </div>
    </>
  );
}

export default App;
