import express from 'express';
import { submitQuiz, getQuizResult, getQuizHistory } from './quiz.controller.js';

const router = express.Router();

router.post('/quiz/submit', submitQuiz);
router.get('/quiz/:id', getQuizResult);
router.get('/quiz/:id/history', getQuizHistory);

export default router;