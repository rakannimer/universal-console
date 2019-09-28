import io from "socket.io-client";

const PORT = 7331;
const URL = `http://localhost:${PORT}/`;
const socket = io(URL);

let isConnected = false;
let offlineActions = [];

const createConsoleMethod = type => async (...args) => {
  if (isConnected) {
    socket.emit("universal-console", {
      type,
      payload: args
    });
  } else {
    offlineActions.push([
      "universal-console",
      {
        type,
        payload: args
      }
    ]);
  }
};

socket.on("connect", () => {
  isConnected = true;
  offlineActions.forEach(offlineAction => {
    socket.emit(...offlineAction);
  });
  offlineActions = [];
});

socket.on("disconnect", () => {
  isConnected = false;
});

const consoleMethods = [
  "assert",
  "clear",
  "context",
  "count",
  "countReset",
  "debug",
  "dir",
  "dirxml",
  "error",
  "group",
  "groupCollapsed",
  "groupEnd",
  "info",
  "log",
  "table",
  "time",
  "timeEnd",
  "timeLog",
  "timeStamp",
  "trace",
  "warn"
];

const universalConsole = {};
for (let consoleMethod of consoleMethods) {
  universalConsole[consoleMethod] = createConsoleMethod(consoleMethod);
}

module.exports = universalConsole;
