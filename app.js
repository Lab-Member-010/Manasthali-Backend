import express from "express";
import mongoose from "mongoose";
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';

import badgeRouter from "./routes/badge.route.js";
import commentRouter from "./routes/comment.route.js";
import communityRouter from "./routes/community.route.js";
import groupRouter from "./routes/group.route.js";
import groupmessageRouter from "./routes/groupmessage.route.js";
import mentalCoachRouter from "./routes/mentalCoach.route.js";
import messageRouter from "./routes/message.route.js";
import notificationRouter from "./routes/notification.route.js";
import postRouter from "./routes/post.route.js";
import quizRouter from "./routes/quiz.route.js";
import storyRouter from "./routes/story.route.js";
import userRouter from "./routes/user.route.js";
import challengesRoute from "./routes/challengesFile.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("Database connected...");
    
    // Add all the routes
    app.use("/comments", commentRouter);
    app.use("/communities", communityRouter);
    app.use("/groups", groupRouter);
    app.use("/groupchat", groupmessageRouter);
    app.use("/mentalCoach", mentalCoachRouter);
    app.use("/message", messageRouter);
    app.use("/notifications", notificationRouter);
    app.use("/posts", postRouter);
    app.use("/quiz", quizRouter);
    app.use("/story", storyRouter);
    app.use("/badges", badgeRouter);
    app.use("/users", userRouter);
    app.use("/challenge", challengesRoute);

    // Socket.IO for real-time group chat functionality
    io.on('connection', (socket) => {
      console.log('A user connected');

      // Event to join a room (group chat)
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      });

      // Event to send a message in a group (group chat)
      socket.on('send-message-group', (data) => {
        try {
          if (!data.roomId || !data.message || !data.senderId) {
            throw new Error('Room ID, message, or sender ID missing');
          }

          // Broadcast the message to the specific room (group chat)
          io.to(data.roomId).emit('receive-message-group', {
            message: data.message,
            senderId: data.senderId,
            timestamp: new Date().toISOString(),
          });

        } catch (err) {
          console.error("Error sending message:", err);
        }
      });

      // Event to send a message to a specific user (one-on-one chat)
      socket.on('send-message', (data) => {
        try {
          if (!data.receiverId || !data.message || !data.senderId) {
            throw new Error('Receiver ID, message, or sender ID missing');
          }

          // Send the message directly to the receiver
          io.to(data.receiverId).emit('receive-message', {
            message: data.message,
            senderId: data.senderId,
            timestamp: new Date().toISOString(),
          });

        } catch (err) {
          console.error("Error sending message:", err);
        }
      });

      // Event to leave a room (group chat)
      socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
      });

      // Handle socket disconnection
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    // Start the server
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server started on port ${port}...`);
    });

  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
