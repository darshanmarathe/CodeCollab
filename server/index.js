var app = require('express')();
var http = require('http').createServer(app);
var cors = require('cors')

const PORT = 3001;
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
    sockets: []
  }
}


app.use(cors())

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});


io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
  socket.on('channel-join', id => {
    let chan = STATIC_CHANNELS.find((x) => x.id === id)
    if (!chan) {
      chan = CreateChannel(id);
      chan.sockets.push(socket.id);
      chan.participants++;
      console.log("New Channel Added" , id)
      io.emit('channel', chan);
      STATIC_CHANNELS.push(chan)
    } else {
      STATIC_CHANNELS.forEach(c => {
        if (c.id === id) {
          if (c.sockets.indexOf(socket.id) == (-1)) {
            c.sockets.push(socket.id);
            c.participants++;
            io.emit('channel', c);
          }
        } else {
          let index = c.sockets.indexOf(socket.id);
          if (index != (-1)) {
            c.sockets.splice(index, 1);
            c.participants--;
            io.emit('channel', c);
          }
        }
      });
    }
    socket.emit('connection', null);
    return id;
  });
  socket.on('coded', coded => {
    console.log("coded received");
    io.emit('coded', coded);
  });

  socket.on('disconnect', () => {
    STATIC_CHANNELS.forEach(c => {
      let index = c.sockets.indexOf(socket.id);
      if (index != (-1)) {
        c.sockets.splice(index, 1);
        c.participants--;
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