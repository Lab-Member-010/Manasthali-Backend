import express from 'express';
import { submitQuiz} from '../controller/quiz.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// submit quiz result
router.post('/submit',auth, submitQuiz);

export default router;