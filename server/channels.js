const { DEFAULT_LANGUAGE, DEFAULT_CODE, USER_COLORS } = require("./config");
const nameGen = require("./common/namesgenerator");

class ChannelManager {
  constructor() {
    this.channels = [];
  }

  findById(id) {
    return this.channels.find((c) => c.id === id);
  }

  getAll() {
    return this.channels;
  }

  create(id) {
    const channel = {
      name: id,
      id,
      participants: 0,
      language: DEFAULT_LANGUAGE,
      text: DEFAULT_CODE,
      sockets: [],
      users: [],
      strokes: null,
    };
    this.channels.push(channel);
    return channel;
  }

  remove(id) {
    this.channels = this.channels.filter((c) => c.id !== id);
  }

  addUser(channel, socketId) {
    if (channel.sockets.includes(socketId)) return null;

    const user = {
      userId: socketId,
      name: nameGen.NameGenerator(),
      color: USER_COLORS[channel.users.length % USER_COLORS.length],
    };

    channel.sockets.push(socketId);
    channel.participants++;
    channel.users.push(user);

    return user;
  }

  removeUser(channel, socketId) {
    const idx = channel.sockets.indexOf(socketId);
    if (idx === -1) return false;

    channel.sockets.splice(idx, 1);
    channel.participants--;
    channel.users = channel.users.filter((u) => u.userId !== socketId);
    return true;
  }

  updateCode(channel, text, language) {
    channel.text = text;
    if (language) channel.language = language;
  }

  updateLanguage(channel, language) {
    channel.language = language;
  }

  appendStrokes(channel, strokes) {
    if (!channel.strokes) {
      channel.strokes = strokes;
    } else {
      channel.strokes.paths = [...channel.strokes.paths, ...strokes.paths];
    }
  }

  cleanupEmpty() {
    this.channels = this.channels.filter((c) => c.participants > 0);
  }
}

module.exports = ChannelManager;
