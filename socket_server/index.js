const httpServer = require("http").createServer();

const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
});

httpServer.listen(6000);