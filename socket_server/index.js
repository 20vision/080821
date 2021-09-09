const express = require("express");
const httpServer = require("http").createServer(express());
const {Server} = require("socket.io")
const cookies = require("cookies");

const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
});

io.use((socket, next) => {
  if (socket.handshake.headers.cookie) {
    next(new Error("not authenticated"));
  } else {
    next(new Error("not authenticated"));
  }
});

io.on("connection", (socket) => {
  console.log('connected')
  console.log(socket.handshake.headers.cookie)
  socket.on('hello', function(hello) {
    console.log('hello')
  })
});

httpServer.listen(4500);