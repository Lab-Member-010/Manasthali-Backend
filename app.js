import express from "express";
import mongoose from "mongoose";
import http from 'http';
import { Server } from 'socket.io';  
import bodyParser from "body-parser";
import cors from "cors";

import badgeRouter from "./routes/badge.route.js";
import commentRouter from "./routes/comment.route.js";
import communityRouter from "./routes/community.route.js";
import gameRouter from "./routes/game.route.js";
import groupRouter from "./routes/group.route.js";
import leaderboardRouter from "./routes/leaderboard.route.js";
import mentalCoachRouter from "./routes/mentalCoach.route.js";
import messageRouter from "./routes/message.route.js";
import notificationRouter from "./routes/notification.route.js";
import postRouter from "./routes/post.route.js";
import quizRouter from "./routes/quiz.route.js";
import storyRouter from "./routes/story.route.js";
import userRouter from "./routes/user.route.js"; 
import challangesRoute from "./routes/challengesFile.route.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/mitraDb")
  .then(() => {
    console.log("Database connected...");

    app.use("/comments", commentRouter);
    app.use("/communities", communityRouter);
    app.use("/games", gameRouter);
    app.use("/groups", groupRouter);
    app.use("/leaderboards", leaderboardRouter);
    app.use("/mentalCoach", mentalCoachRouter);
    app.use("/message",messageRouter);
    app.use("/notifications", notificationRouter);
    app.use("/posts", postRouter);
    app.use("/quiz", quizRouter);
    app.use("/story", storyRouter);
    app.use("/badges", badgeRouter);
    app.use("/users", userRouter);
    app.use("/challange", challangesRoute);

    io.on('connection', (socket) => {
      console.log('A user connected');
      
      // Listen for new messages and broadcast them
      socket.on('send-message', (data) => {
        io.to(data.receiverId).emit('receive-message', data);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    server.listen(3001, () => {
      console.log('Server started...');
    });
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
