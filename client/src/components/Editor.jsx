import React, { Component } from 'react'
import Editor from "@monaco-editor/react";
import socketClient from "socket.io-client";
const { REACT_APP_BACKEND } = process.env;
const SERVER = REACT_APP_BACKEND;


export default class EditorWrapper extends Component {


    socket = null;
    editorRef = null;
    constructor(props) {
        super(props);
        this.state = {
            language: props.language,
            code: props.code,
            meetingCode: props.meetingCode,
        }
        this.showValue.bind(this);
    }

    componentDidMount() {
        this.socket = socketClient(SERVER);

        this.socket.on('connection', () => {
            console.log('connected');
        });
        this.socket.on('channel', channel => {
            if (channel.meetingCode === this.props.meetingCode)
                this.setState({ code: channel.text, language: channel.language, meetingCode: channel.meetingCode })
            if (this.props.language !== channel.language) {
                this.props.onLanguageChanged(channel.language)
            }

            this.props.onUsersChanged(channel.participants)

        });
        this.socket.on('coded', message => {
            if (message.meetingCode === this.props.meetingCode)
                this.setState({ code: message.text, language: message.language, meetingCode: message.meetingCode })
            if (this.props.language !== message.language) {
                this.props.onLanguageChanged(message.language)
            }
        });
        this.socket.emit('channel-join', this.state.meetingCode, ack => {
            console.log('channel Joined', ack)
        });
    }

    showValue = (value, event) => {
        console.log(value, event)
        const text = value;
        this.setState({ code: text });
            const mess = {
                meetingCode: this.props.meetingCode,
                text,
                language: this.state.language
            }
            console.log(mess)
            this.socket.emit('coded', mess);
            console.log("Show value happned", text);
    
    }



    render() {
        return (
            <div>
{REACT_APP_BACKEND}

                <Editor
                    height="100vh"
                    width="90vw"
                    theme="vs-dark"
                    style={{ float: 'left' }}
                    onChange={this.showValue}
                    path={this.state.language}
                    defaultLanguage={this.state.language}
                    value={this.state.code}
                    //defaultValue={code}
                    onMount={this.handleEditorDidMount}
                />
            </div>
        )
    }
}
