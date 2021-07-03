import React, { Component } from 'react'
import Editor from "@monaco-editor/react";
import socketClient from "socket.io-client";
const SERVER = "http://localhost:3001";


export default class EditorWrapper extends Component {

    
    socket = null;
    editorRef = null;
    constructor(props) {
        super(props);
        this.state = { 
            language: props.language, 
            code: props.code, 
            meetingCode: props.meetingCode, 
            isFirstime : true
        }
        console.log(this.state)
        this.showValue.bind(this);
    }

    componentDidMount() {
        this.socket = socketClient(SERVER);

        this.socket.on('connection', () => {
            console.log('connected');
        });
        this.socket.on('channel', channel => {
            console.log('channel happened', channel)
            this.setState({ code: channel.text , language:channel.language , meetingCode: channel.meetingCode})
        });
        this.socket.on('coded', message => {
             if (message.meetingCode === this.props.meetingCode)
                 this.setState({ code: message.text , language:message.language , meetingCode: message.meetingCode})
        });
        this.socket.emit('channel-join', this.state.meetingCode, ack => {
            console.log('channel Joined', ack)
        });
    }

    showValue = (value, event) => {
        console.log(value, event)
        const text = value;
        this.setState({code : text});
        if(!this.state.isFirstime){
            const mess = { 
                meetingCode : this.props.meetingCode, 
                text , 
                language : this.state.language  
            }
            console.log(mess)
            this.socket.emit('coded', mess);
            console.log("Show value happned" , text  );
        }else{
            this.setState({isFirstime : false})
        }
       
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
