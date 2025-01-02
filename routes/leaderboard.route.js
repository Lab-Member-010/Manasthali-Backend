import express from 'express';
import { getCurrentLeaderboard, getLeaderboardByType } from './leaderboard.controller.js';

const router = express.Router();

router.get('/leaderboard', getCurrentLeaderboard);
router.get('/leaderboard/:type', getLeaderboardByType);

export default router;