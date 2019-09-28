const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const killPort = require("kill-port");
const PORT = 7331;
const app = express();
const httpServer = http.createServer(app);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const startHttpServer = () => {
  const server = httpServer.listen(PORT, () => {
    console.log(`Ready on http://localhost:${PORT}`);
  });
  return () => {
    server.removeAllListeners();
  };
};
const startSocketIOServer = () => {
  const io = socketio(httpServer);
  const unsub = io.on("connection", function(socket) {
    console.log("a user connected");

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
    socket.on("universal-console", action => {
      console.log("RECEIVED universal-console action", action);
      io.emit("universal-console", action);
    });
    // socket.emit("universal-console", {
    //   type: "log",
    //   payload: ["Hello ", "world"]
    // });
  });
  const stop = () => {
    unsub.removeAllListeners();
  };
  return stop;
};

const main = async () => {
  await killPort(PORT);
  startHttpServer();
  startSocketIOServer();
};
// start http server and logs how to use
(async () => {
  await main();
})();
