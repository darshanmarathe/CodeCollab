(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{45:function(e,n,a){},46:function(e,n,a){},81:function(e,n,a){"use strict";a.r(n);var t=a(1),i=a.n(t),o=a(34),d=a.n(o),c=(a(45),a(3)),s=(a(46),[{id:1,name:"apex"},{id:2,name:"azcli"},{id:3,name:"bat"},{id:4,name:"c"},{id:5,name:"clojure"},{id:6,name:"coffeescript"},{id:7,name:"cpp"},{id:8,name:"csharp"},{id:9,name:"csp"},{id:10,name:"css"},{id:11,name:"dockerfile"},{id:12,name:"fsharp"},{id:13,name:"go"},{id:14,name:"graphql"},{id:15,name:"handlebars"},{id:16,name:"html"},{id:17,name:"ini"},{id:18,name:"java"},{id:19,name:"javascript"},{id:20,name:"json"},{id:21,name:"kotlin"},{id:22,name:"less"},{id:23,name:"lua"},{id:24,name:"markdown"},{id:25,name:"msdax"},{id:26,name:"mysql"},{id:27,name:"objective-c"},{id:28,name:"pascal"},{id:29,name:"perl"},{id:30,name:"pgsql"},{id:31,name:"php"},{id:32,name:"plaintext"},{id:33,name:"postiats"},{id:34,name:"powerquery"},{id:35,name:"powershell"},{id:36,name:"pug"},{id:37,name:"python"},{id:38,name:"r"},{id:39,name:"razor"},{id:40,name:"redis"},{id:41,name:"redshift"},{id:42,name:"ruby"},{id:43,name:"rust"},{id:44,name:"sb"},{id:45,name:"scheme"},{id:46,name:"scss"},{id:47,name:"shell"},{id:48,name:"sol"},{id:49,name:"sql"},{id:50,name:"st"},{id:51,name:"swift"},{id:52,name:"tcl"},{id:53,name:"typescript"},{id:54,name:"vb"},{id:55,name:"xml"},{id:56,name:"yaml"}]),r=a(2);function l(e){return Object(r.jsx)("select",{className:"language-picker",value:s.find((function(n){return n.name===e.value})).id||19,onChange:function(n){e.onLanguageChange(n.target.value)},children:function(){var e=s.map((function(e){return Object(r.jsx)("option",{value:e.id,children:e.name},e.id)}));return Object(r.jsxs)(r.Fragment,{children:[" ",e," "]})}()})}var m=Object(t.memo)(l),u=a(35),g=a(36),h=a(14),p=a(40),j=a(39),f=a(38),b=a(37),v=a.n(b),C=function(e){Object(p.a)(a,e);var n=Object(j.a)(a);function a(e){var t;return Object(u.a)(this,a),(t=n.call(this,e)).socket=null,t.editorRef=null,t.showValue=function(e,n){console.log(e,n);var a=e;t.setState({code:a});var i={meetingCode:t.props.meetingCode,text:a,language:t.state.language};console.log(i),t.socket.emit("coded",i),console.log("Show value happned",a)},t.state={language:e.language,code:e.code,meetingCode:e.meetingCode},t.showValue.bind(Object(h.a)(t)),t}return Object(g.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.socket=v()("/"),this.socket.on("connection",(function(){console.log("connected")})),this.socket.on("channel",(function(n){n.meetingCode===e.props.meetingCode&&e.setState({code:n.text,language:n.language,meetingCode:n.meetingCode}),e.props.language!==n.language&&e.props.onLanguageChanged(n.language),e.props.onUsersChanged(n.participants)})),this.socket.on("coded",(function(n){n.meetingCode===e.props.meetingCode&&e.setState({code:n.text,language:n.language,meetingCode:n.meetingCode}),e.props.language!==n.language&&e.props.onLanguageChanged(n.language)})),this.socket.emit("channel-join",this.state.meetingCode,(function(e){console.log("channel Joined",e)}))}},{key:"render",value:function(){return Object(r.jsxs)("div",{children:["/",Object(r.jsx)(f.a,{height:"100vh",width:"90vw",theme:"vs-dark",style:{float:"left"},onChange:this.showValue,path:this.state.language,defaultLanguage:this.state.language,value:this.state.code,onMount:this.handleEditorDidMount})]})}}]),a}(t.Component);var O=function(){var e="// write code here...",n=Object(t.useState)(0),a=Object(c.a)(n,2),i=a[0],o=a[1],d=Object(t.useState)("javascript"),l=Object(c.a)(d,2),u=l[0],g=l[1],h="/"===window.location.pathname?function(e){for(var n="",a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=a.length,i=0;i<e;i++)n+=a.charAt(Math.floor(Math.random()*t));return n}(8):window.location.pathname.replace("/","");return"/"===window.location.pathname&&(window.location.pathname="/"+h),Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("input",{value:h,type:"text",disabled:"true"}),Object(r.jsx)(m,{value:u,onLanguageChange:function(e){return function(e){var n=s.find((function(n){return n.id===parseInt(e)}));g(n.name)}(e)}}),"Users:",i,Object(r.jsx)("br",{}),Object(r.jsxs)("div",{style:{width:"100%",border:"1px solid red"},children:[Object(r.jsx)(C,{language:u,meetingCode:h,code:e,onUsersChanged:o,onLanguageChanged:g}),Object(r.jsx)("pre",{children:e})]})]})},x=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,82)).then((function(n){var a=n.getCLS,t=n.getFID,i=n.getFCP,o=n.getLCP,d=n.getTTFB;a(e),t(e),i(e),o(e),d(e)}))};d.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(O,{})}),document.getElementById("root")),x()}},[[81,1,2]]]);
//# sourceMappingURL=main.ce631470.chunk.js.map