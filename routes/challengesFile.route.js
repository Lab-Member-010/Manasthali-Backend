import express from "express";
import { auth } from "../middleware/auth.js";
import { getDailyChallenge } from "../controller/challengesFile.controller.js";

const router = express.Router();

// Route to get the daily challenge for the logged-in user
router.get("/daily-challenge/:userId", auth, getDailyChallenge);

export default router;
