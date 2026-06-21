function setupSocket(io, channelManager) {
  io.on("connection", (socket) => {
    socket.on("channel-join", (id) => {
      let channel = channelManager.findById(id);

      if (!channel) {
        channel = channelManager.create(id);
      }

      const user = channelManager.addUser(channel, socket.id);
      if (!user) return;

      user.meetingCode = id;
      channel.lastUserJoined = user;

      io.emit("channel", channel);
      socket.emit("userdata", Object.values(channel.users));
      socket.emit("connected", { user });
      socket.emit("connection", null);
    });

    socket.on("selection", (data) => {
      data.userId = socket.id;
      socket.broadcast.emit("selection", data);
    });

    socket.on("coded", (coded) => {
      const channel = channelManager.findById(coded.meetingCode);
      if (channel) {
        channelManager.updateCode(channel, coded.text, coded.language);
      }
      io.emit("coded", coded);
    });

    socket.on("message", (message) => {
      io.emit("message", message);
    });

    socket.on("drawn", (strokes, meetingCode) => {
      const channel = channelManager.findById(meetingCode);
      if (channel) {
        channelManager.appendStrokes(channel, strokes);
      }
      io.emit("drawn", strokes, meetingCode);
    });

    socket.on("language-changed", (data) => {
      const channel = channelManager.findById(data.meetingCode);
      if (channel) {
        channelManager.updateLanguage(channel, data.language);
      }
      io.emit("language-changed", data);
    });

    socket.on("disconnect", () => {
      channelManager.getAll().forEach((channel) => {
        if (channelManager.removeUser(channel, socket.id)) {
          io.emit("channel", channel);
        }
      });
      channelManager.cleanupEmpty();
    });
  });
}

module.exports = setupSocket;
