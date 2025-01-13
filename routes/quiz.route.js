import express from 'express';
import { submitQuiz, getQuizResult,addPersonalityType} from '../controller/quiz.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// submit quiz result
router.post('/submit',auth, submitQuiz);

// get quiz results
router.get('/get-result',auth ,getQuizResult);

// Add Personality Type from Quiz to User
router.get('/add-personality-type', auth, addPersonalityType);

export default router;