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
            isFirstTime: true,
            clientId: null
        }
        this.showValue.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.isFirstTime)
            return;

        if (prevProps.language !== this.state.language) {

            this.setState({ language: this.props.language });
        }
    }

    componentDidMount() {
        this.socket = socketClient(SERVER);

        this.socket.on('connection', () => {
            console.log('connected');
            this.setState({ clientId: this.socket.id })
        });
        this.socket.on('channel', channel => {
            if (channel.name === this.props.meetingCode) {
                this.setState({ code: channel.text, language: channel.language, meetingCode: channel.meetingCode })
                if (this.props.language !== channel.language) {
                    this.props.onLanguageChanged(channel.language)
                }

            }
            this.props.onUsersChanged(channel.participants)

        });
        this.socket.on('coded', message => {
            if (message.meetingCode === this.props.meetingCode
                && message.clientId !== this.state.clientId) {
                this.setState({ code: message.text, language: message.language, meetingCode: message.meetingCode })
                if (this.props.language !== message.language) {
                    this.props.onLanguageChanged(message.language)
                }
            }
        });
        this.socket.emit('channel-join', this.state.meetingCode, ack => {
            console.log('channel Joined', ack)
        });
        this.setState({ isFirstTime: false })
    }

    showValue = (value, event) => {
        const text = value;
        this.setState({ code: text });
        const mess = {
            meetingCode: this.props.meetingCode,
            text,
            language: this.state.language,
            clientId: this.state.clientId
        }


        this.socket.emit('coded', mess);
    }



    render() {
        return (
            <div>
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
