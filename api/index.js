const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AuthController = require("./controllers/AuthController");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MessageController = require("./controllers/MessageController")
const profileRoutes = require("./controllers/ProfileController")

const http = require("http");
const { Server } = require("socket.io");
dotenv.config();
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

app.use("/api/auth", AuthController);
app.use("/api/message",MessageController)
app.use('/api/profile', profileRoutes);

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to DB");
};

app.listen(5000, async () => {
  await connectDb();
  console.log("server listening on port 5000");
});

server.listen(8900, () => {
  console.log("socket listening on port 8900");
});
