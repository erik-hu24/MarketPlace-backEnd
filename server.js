const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

// const app = express();
const server = http.createServer(app); // 创建 HTTP 服务器
const io = new Server(server, {
    path: "/socket.io/", // 默认路径，确保未被覆盖
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });
  

// 示例路由
app.get("/", (req, res) => {
  res.send("Hello, Socket.IO!");
});

// Socket.IO 连接
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 接收消息
  socket.on("chat message", (msg) => {
    console.log("Message received:", msg);
    io.emit("chat message", msg); // 广播消息给所有客户端
  });

  // 监听用户断开连接
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


module.exports = { server };