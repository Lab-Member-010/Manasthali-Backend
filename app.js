import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import badgeRouter from "./routes/badge.route.js";
import challangeRouter from "./routes/challenge.route.js";
import commentRouter from "./routes/comment.route.js";
import challangeRouter from "./routes/community.route.js";
import challangeRouter from "./routes/game.route.js";
import challangeRouter from "./routes/group.route.js";
import challangeRouter from "./routes/leaderboard.route.js";
import challangeRouter from "./routes/mentalCoach.route.js";
import challangeRouter from "./routes/notification.route.js";
import challangeRouter from "./routes/post.route.js";
import challangeRouter from "./routes/quiz.route.js";
import challangeRouter from "./routes/story.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/mitraDb")
.then(() => {
    console.log("Database connected...");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/challanges", challangeRouter);
    app.use("/comments", commentRouter);
    app.use("/communitys", communityRouter);
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

    app.listen(3001, () => {
        console.log("Server Started....");
    });
}).catch(err => {
    console.log(err);
});