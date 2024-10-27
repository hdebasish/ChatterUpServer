import "./env.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import { connectUsingMongoose } from "./config/mongoose.config.js";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";
import { chatModel } from "./schema/chat.schema.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use("/api", router);

let users = [];
let usernames = [];

io.on("connection", (socket) => {
  console.log("Connection is established");

  socket.on("connected-user", async (userInfo) => {
    socket.emit("current_user", userInfo);

    const chats = await chatModel.find().sort({ timeStamp: 1 }).limit(50);
    socket.emit("load-messages", chats);

    const user = usernames.includes(userInfo.username);

    if (!user) {
      socket.broadcast.emit("joined_user", userInfo);
      users[socket.id] = userInfo;
      usernames.push(userInfo);
    }

    let userList = usernames.filter((item) => item !== userInfo);
    socket.emit("getUsers", userList);
  });

  socket.on("typing-user", (userInfo) => {
    socket.broadcast.emit("typing", userInfo);
  });

  socket.on("send_chat_msg", async (userInfo, message, time) => {
    const newChat = new chatModel({
      username: userInfo.username,
      message: message,
      image: userInfo.image,
      timeStamp: new Date(),
    });

    await newChat.save();

    socket.broadcast.emit("receive_chat_msg", userInfo, message, time);
  });

  socket.on("disconnect", () => {
    console.log("Connection has been disconnected");
    let userName = users[socket.id];
    if (userName) {
      delete users[socket.id];
      socket.broadcast.emit("disconnected_user", userName);
      usernames = usernames.filter((user) => user !== userName);
    }
  });
});

server.listen(3000, () => {
  console.log(`Server started on port 3000`);
  connectUsingMongoose();
});
