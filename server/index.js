const express = require("express");
const http = require("http");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const { PORT, SOCKET_OPTIONS, PEER_OPTIONS } = require("./config");
const ChannelManager = require("./channels");
const createRoutes = require("./routes");
const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, SOCKET_OPTIONS);
const channelManager = new ChannelManager();

app.use(cors());
app.use(createRoutes(channelManager));

const peerServer = ExpressPeerServer(server, PEER_OPTIONS);
app.use("/peerjs", peerServer);

setupSocket(io, channelManager);

server.listen(PORT, () => {
  console.clear();
  console.log(`Server listening on *:${PORT}`);
});
