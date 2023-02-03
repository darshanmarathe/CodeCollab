import React, { Component } from "react";
import Editor from "@monaco-editor/react";
import socketClient from "socket.io-client";
const { REACT_APP_BACKEND } = process.env;
const SERVER = REACT_APP_BACKEND;

export default class EditorWrapper extends Component {
  users = {};
  decorations = {};
  socket = null;
  editorRef = null;
  _editor = undefined;
  contentWidgets = {};
  isTooEarly = false;

  constructor(props) {
    super(props);
    this.state = {
      monaco: null,
      language: props.language,
      code: props.code,
      meetingCode: props.meetingCode,
      isFirstTime: true,
      clientId: null,
    };
    this.showValue.bind(this);
    //this.handleEditorDidMount.bind(this);
  }

  SetTooEarly = (time = 1500) => {
    setInterval(() => {
      this.isTooEarly = !this.isTooEarly;
    }, time);
    
  };

  handleEditorDidMount = (editor, monaco) => {
    this._editor = editor;

    editor.onDidChangeCursorSelection((e) => {
      this.socket.emit("selection", {
        event: e,
        meetingCode: this.props.meetingCode,
        userId: this.state.clientId,
      });
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.isFirstTime) return;

    if (prevProps.language !== this.state.language) {
      this.setState({ language: this.props.language });
    }
  }

  insertCSS(id, color) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML += "." + id + " { background-color:" + color + "}\n"; //Selection Design
    style.innerHTML += `
        .${id}one { 
            background: ${color};
            width:2px !important 
        }`; //cursor Design
    document.getElementsByTagName("head")[0].appendChild(style);
  }
  /**
   * add Widget to new user (display name) - 새로운 사용자를 위한 위젯을 추가한다 (이름을 출력하는 곳)
   * @param {User} e user
   */
  insertWidget(e) {
    this.contentWidgets[e.userId] = {
      domNode: null,
      position: {
        lineNumber: 0,
        column: 0,
      },
      getId: function () {
        return "content." + e.userId;
      },
      getDomNode: function () {
        if (!this.domNode) {
          this.domNode = document.createElement("div");
          this.domNode.innerHTML = e.name;
          this.domNode.style.background = e.color;
          this.domNode.style.color = "black";
          this.domNode.style.opacity = 0.8;
          this.domNode.style.width = "max-content";
        }
        return this.domNode;
      },
      getPosition: function () {
        return {
          position: this.position,
          preference: [
            window.monaco.editor.ContentWidgetPositionPreference.ABOVE,
            window.monaco.editor.ContentWidgetPositionPreference.BELOW,
          ],
        };
      },
    };
  }

  changeSeleciton(data) {
    const e = data.event;
    var selectionArray = [];
    if (
      e.selection.startColumn == e.selection.endColumn &&
      e.selection.startLineNumber == e.selection.endLineNumber
    ) {
      //if cursor - 커서일 때
      e.selection.endColumn++;
      selectionArray.push({
        range: e.selection,
        options: {
          className: `${data.userId}one`,
          hoverMessage: {
            value: data.userId,
          },
        },
      });
    } else {
      //if selection - 여러개를 선택했을 때
      selectionArray.push({
        range: e.selection,
        options: {
          className: data.userId,
          hoverMessage: {
            value: data.userId,
          },
        },
      });
    }
    for (let data of e.secondarySelections) {
      //if select multi - 여러개를 선택했을 때
      if (
        data.startColumn == data.endColumn &&
        data.startLineNumber == data.endLineNumber
      ) {
        selectionArray.push({
          range: data,
          options: {
            className: `${data.userId}one`,
            hoverMessage: {
              value: data.userId,
            },
          },
        });
      } else
        selectionArray.push({
          range: data,
          options: {
            className: data.userId,
            hoverMessage: {
              value: data.userId,
            },
          },
        });
    }
    console.table(this.decorations, data.userId);
    this.decorations[data.userId] = this._editor.deltaDecorations(
      this.decorations[data.userId],
      selectionArray
    ); //apply change - 변경내용을 적용시킴
  }

  changeWidgetPosition(data) {
    const e = data.event;
    this.contentWidgets[data.userId].position.lineNumber =
      e.selection.endLineNumber;
    this.contentWidgets[data.userId].position.column = e.selection.endColumn;

    this._editor.removeContentWidget(this.contentWidgets[data.userId]);
    this._editor.addContentWidget(this.contentWidgets[data.userId]);
  }

  componentDidMount() {
    this.socket = socketClient(SERVER, {
      reconnection: true, // Whether to reconnect automatically (default: true)
      reconnectionDelay: 500, // Number of reconnection attempts before giving (default: Infinity)
      reconnectionAttempts: 10, // How long to initially wait before attempting a new reconnection (default: 1000)
    });

    this.socket.on("connection", () => {
      console.info("connection");
      this.setState({ clientId: this.socket.id });
    });
    this.socket.on("channel", (channel) => {
      console.info("channel", channel);
      
      if (channel.name === this.props.meetingCode) {
        this.props.onUserConnect(channel.LastUserJoined.name);
        this.setState({
          code: channel.text,
          language: channel.language,
          meetingCode: channel.meetingCode,
        });
        if (this.props.language !== channel.language) {
          this.props.onLanguageChanged(channel.language);
        }
        this.SetTooEarly();
      }
      this.props.onUsersChanged(channel.users);
    });
    this.socket.on("coded", (message) => {
      if (
        message.meetingCode === this.props.meetingCode &&
        message.clientId !== this.state.clientId
      ) {
        this.setState({
          code: message.text,
          language: message.language,
          meetingCode: message.meetingCode,
        });

        this._editor.getModel().applyEdits(message.event.changes);
        if (this.props.language !== message.language) {
          this.props.onLanguageChanged(message.language);
        }
      }
    });
    this.socket.on("userdata", (data) => {
      //Connected Client Status Event

      for (var i of data) {
        this.users[i.userId] = i.color;
        this.insertCSS(i.userId, i.color);
        this.insertWidget(i);
        this.decorations[i.userId] = [];
      }
    });
    this.socket.emit("channel-join", this.state.meetingCode, (ack) => {
      console.log("channel Joined", ack);
    });
    this.socket.on("selection", (message) => {
      //change Selection Event
      console.info("selection", message);
      if (
        message.meetingCode === this.props.meetingCode &&
        message.userId !== this.state.clientId
      ) {
        this.changeSeleciton(message);
        this.changeWidgetPosition(message);
      }
    });
    this.setState({ isFirstTime: false });
  }

  showValue = (value, event) => {

    console.warn(this.isTooEarly)
    if (this.isTooEarly !== false) {
      const text = value;
      this.setState({ code: text });
      const message = {
          meetingCode: this.props.meetingCode,
          text,
          language: this.state.language,
          clientId: this.state.clientId,
          event,
        };
        this.socket.emit("coded", message);
    }

  };

  render() {
    return (
      <div>
        <Editor
          height="100vh"
          width="90vw"
          theme="vs-light"
          style={{ float: "left" }}
          onChange={this.showValue}
          path={this.state.language}
          defaultLanguage={this.state.language}
          value={this.state.code}
          //defaultValue={code}
          onMount={this.handleEditorDidMount}
        />
      </div>
    );
  }
}
