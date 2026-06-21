module.exports = {
  PORT: process.env.PORT || 3000,

  SOCKET_OPTIONS: {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingInterval: 2000,
    pingTimeout: 5000,
  },

  PEER_OPTIONS: {
    debug: true,
  },

  DEFAULT_LANGUAGE: "javascript",
  DEFAULT_CODE: "//type some code here....",

  USER_COLORS: [
    "#DDFFAA",
    "#95E0C8",
    "#E18060",
    "#FFCBA4",
    "#90f867",
    "#B8D4E3",
    "#F3C9E8",
    "#C5E8B7",
    "#F5D0A9",
    "#D4B8E0",
  ],
};
