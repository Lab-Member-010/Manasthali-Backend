import express from 'express';
import { getDailyChallenges, submitChallenge, getChallengeHistory } from './challenge.controller.js';

const router = express.Router();

router.get('/challenges/:personalityType', getDailyChallenges);
router.post('/challenges/submit', submitChallenge);
router.get('/challenges/history/:userId', getChallengeHistory);

export default router;