const express = require("express");
const path = require("path");

function createRoutes(channelManager) {
  const router = express.Router();

  const serveFile = (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
  };

  router.use(express.static(path.join(__dirname, "public")));

  router.get("/", serveFile);

  router.get("/getChannels", (req, res) => {
    res.json({ channels: channelManager.getAll() });
  });

  router.get("/:id", serveFile);

  return router;
}

module.exports = createRoutes;
