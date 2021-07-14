import React, { Component } from 'react'
import Editor from "@monaco-editor/react";
import socketClient from "socket.io-client";
const { REACT_APP_BACKEND } = process.env;
const SERVER = REACT_APP_BACKEND;


export default class EditorWrapper extends Component {

    users = {}
    decorations= {};
    socket = null;
    editorRef = null;
    constructor(props) {
        super(props);
        this.state = {
            monaco : null,
            language: props.language,
            code: props.code,
            meetingCode: props.meetingCode,
            isFirstTime: true,
            clientId: null,
            contentWidgets: {},
            
        }
        this.showValue.bind(this);
        //this.handleEditorDidMount.bind(this);
    }

    handleEditorDidMount = (arg1 , arg2 , arg3) =>{
        debugger;
        //this.monaco = arg2;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.isFirstTime)
            return;

        if (prevProps.language !== this.state.language) {

            this.setState({ language: this.props.language });
        }
    }

    insertCSS(id, color) {

        var style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML += '.' + id + ' { background-color:' + color + '}\n' //Selection Design
        style.innerHTML += `
        .${id}one { 
            background: ${color};
            width:2px !important 
        }`  //cursor Design
        document.getElementsByTagName('head')[0].appendChild(style)
    }
    /**
     * add Widget to new user (display name) - 새로운 사용자를 위한 위젯을 추가한다 (이름을 출력하는 곳) 
     * @param {User} e user
     */
    insertWidget(e) {
        var contentWidgets = this.state.contentWidgets;
        contentWidgets[e.userId] = {
            domNode: null,
            position: {
                lineNumber: 0,
                column: 0
            },
            getId: function () {
                return 'content.' + e.user
            },
            getDomNode: function () {
                if (!this.domNode) {
                    this.domNode = document.createElement('div')
                    this.domNode.innerHTML = e.user
                    this.domNode.style.background = e.color
                    this.domNode.style.color = 'black'
                    this.domNode.style.opacity = 0.8
                    this.domNode.style.width = 'max-content'
                }
                return this.domNode
            },
            getPosition: function () {
                return {
                    position: this.position,
                   preference: [window.monaco.editor.ContentWidgetPositionPreference.ABOVE, window.monaco.editor.ContentWidgetPositionPreference.BELOW]
                }
            }
        }
        this.setState({ contentWidgets : contentWidgets });
 
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
            this.props.onUsersChanged(channel.users)

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
        this.socket.on('userdata',  (data) => {     //Connected Client Status Event
            debugger;
                for (var i of data) {
                    console.log(i,"i")
                    this.users[i.userId] = i.color
                    this.insertCSS(i.name, i.color)
                    this.insertWidget(i)
                    this.decorations[i.userId] = []
                }
           
        })
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
