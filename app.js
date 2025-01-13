import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import badgeRouter from "./routes/badge.route.js";
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
import userRouter from "./routes/user.route.js"; 
import challangesRoute from "./routes/challengesFile.route.js";
import cors from "cors";

const app = express();

// Apply CORS middleware globally
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

mongoose.connect("mongodb://127.0.0.1:27017/mitraDb")
  .then(() => {
    console.log("Database connected...");

    // Middleware to parse request bodies
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Define routes
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
    app.use("/users", userRouter);
    app.use("/challange", challangesRoute);

    // Start the server
    app.listen(3001, () => {
        console.log("Server Started on http://localhost:3001");
    });
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
