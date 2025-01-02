import express from 'express';
import { getAllGames, getGameDetails, submitGameResults, getGameHistory } from './game.controller.js';

const router = express.Router();

router.get('/games', getAllGames);
router.get('/games/:id', getGameDetails);
router.post('/games/:id/submit', submitGameResults);
router.get('/games/history/:userId', getGameHistory);

export default router;