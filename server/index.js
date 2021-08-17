var express = require('express');
var app = express();
var http = require('http').createServer(app);
var cors = require('cors')
var path  = require("path")  ;
const PORT = process.env.PORT || 3000;

const common  = require('./common/randomColor')
const nameGen  = require('./common/namesgenerator')

var io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



var STATIC_CHANNELS = [];

function CreateChannel(code) {
  return {
    name: code,
    participants: 0,
    id: code,
    language : 'javascript',
    text : '//type some code here....',
    sockets: [],
    users : [],
  }
}

var colors = [  
  '#DDFFAA',
  '#95E0C8',
  '#E18060',
  '#FFCBA4',
  '#90f867'
] 



function CreateUser(userId, userCount) {
  return {
    userId,
    name : nameGen.NameGenerator(),
    color : colors[userCount]
  }
  
}
app.use(cors())

var  ServeFile = function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
}
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', ServeFile);
app.get('/:id', ServeFile);

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
  console.log('connection made')
  socket.on('channel-join', id => {
    let chan = STATIC_CHANNELS.find((x) => x.id === id)
    if (!chan) {
      chan = CreateChannel(id);
      chan.sockets.push(socket.id);
      chan.participants++;
      let user = CreateUser(socket.id, chan.users.length );
      chan.LastUserJoined = {name ,userId,} = user;
      chan.LastUserJoined.meetingCode  =id;
      console.log(chan.LastUserJoined, "chan.LastUserJoined")
      chan.users.push(user)
      io.emit('channel', chan);
      socket.emit('userdata', Object.values(chan.users))
      socket.emit('connected', {user}) 
            
      STATIC_CHANNELS.push(chan)
    } else {

      STATIC_CHANNELS.forEach(c => {
        if (c.id === id) {
          if (c.sockets.indexOf(socket.id) == (-1)) {
            c.sockets.push(socket.id);
            c.participants++;
            let user =CreateUser(socket.id, chan.users.length)
            chan.LastUserJoined = {name ,userId } = user
            chan.LastUserJoined.meetingCode  =id;
            chan.users.push(user)
            console.log("participants added" ,c)
            io.emit('channel', c);
            io.emit('userdata', Object.values(chan.users))
            io.emit('connected', {user}) 
          }
        } else {
          let index = c.sockets.indexOf(socket.id);
          if (index != (-1)) {
            c.sockets.splice(index, 1);
            c.participants--;
            chan.users = chan.users.filter(x => x.userId != socket.id)
            io.emit('channel', c);
          }
        }
        
      });
    }
    socket.emit('connection', null);
    return id;
  });
  socket.on('selection', function (data) {       //Content Select Or Cursor Change Event
    console.log('selection', data.meetingCode , data.userId )
    data.color = socket.color
    data.userId = socket.id
    socket.broadcast.emit('selection', data) 
  }) 
  socket.on('coded', coded => {
    console.log("coded received");
    AddToChannel(coded);
    io.emit('coded', coded);
    
  });

  function AddToChannel(coded){
    console.log(coded , "coded");
    let chan = STATIC_CHANNELS.find((x) => x.id === coded.meetingCode)
    if(chan)  {
        chan.text = coded.text;
        console.log(chan.id , chan.text)
      }
     }

  socket.on('disconnect', () => {
    STATIC_CHANNELS.forEach(c => {
      let index = c.sockets.indexOf(socket.id);
      if (index != (-1)) {
        c.sockets.splice(index, 1);
        c.participants--;
        c.users = c.users.filter(x => x.userId != socket.id)
        io.emit('channel', c);
      }
    });
  });

});

/**
 * @description This methos retirves the static channels
 */
app.get('/getChannels', (req, res) => {
  res.json({
    channels: STATIC_CHANNELS
  })
});
