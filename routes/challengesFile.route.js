import express from "express";
import { getDailyChallenge } from "../controller/challengesFile.controller.js";

const router = express.Router();

// Route to get the daily challenge for the logged-in user
router.get("/daily-challenge", getDailyChallenge);

export default router;