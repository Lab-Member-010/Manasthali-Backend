import express from "express";
import mongoose from "mongoose";
import http from 'http';
import { Server } from 'socket.io';  
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import googleAuthRoutes from "./routes/googleauth.routes.js"
import {auth} from "./middleware/auth.js"
// import passport from "passport";
// import session from "express-session";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";









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
import { access } from "fs";
import { profile } from "console";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    }
});
app.use(googleAuthRoutes);

// Secure Route Example
app.get("/profile", auth, (req, res) => {
  res.json({ user: req.user }); // Access user data added by the `auth` middleware
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URI)
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
        try {
          if (!data.receiverId || !data.message) {
            throw new Error('Receiver or message missing');
          }
          io.to(data.receiverId).emit('receive-message', data);
        } catch (err) {
          console.error("Error sending message:", err);
        }
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log('Server started...');
    });
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
