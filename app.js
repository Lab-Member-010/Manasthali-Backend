import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import badgeRouter from "./routes/badge.route.js";
import challengeRouter from "./routes/challenge.route.js";
import commentRouter from "./routes/comment.route.js";
import communityRouter from "./routes/community.route.js";
import gameRouter from "./routes/game.route.js";
import groupRouter from "./routes/group.route.js";
import leaderboardRouter from "./routes/leaderboard.route.js";
import mentalCoachRouter from "./routes/mentalCoach.route.js";
import notificationRouter from "./routes/notification.route.js";
import postRouter from "./routes/post.route.js";
import quizRouter from "./routes/quiz.route.js";
import storyRouter from "./routes/story.route.js";
import userRouter from "./routes/user.route.js"; // Import your user router

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mitraDb")
  .then(() => {
    console.log("Database connected...");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/challenges", challengeRouter);
    app.use("/comments", commentRouter);
    app.use("/communities", communityRouter);
    app.use("/games", gameRouter);
    app.use("/groups", groupRouter);
    app.use("/leaderboards", leaderboardRouter);
    app.use("/mentalCoach", mentalCoachRouter);
    app.use("/notifications", notificationRouter);
    app.use("/posts", postRouter);
    app.use("/quiz", quizRouter);
    app.use("/story", storyRouter);
    app.use("/badges", badgeRouter);
    app.use("/users", userRouter); // Use your user router

    app.listen(3001, () => {
      console.log("Server Started....");
      });
     })
   .catch(err => {
    console.error(err);
    });