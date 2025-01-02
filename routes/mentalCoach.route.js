import express from 'express';
import { startSession, getSessionDetails, sendMessage, resolveSession } from './mentalCoach.controller.js';

const router = express.Router();

router.post('/coach/start', startSession);
router.get('/coach/:sessionId', getSessionDetails);
router.post('/coach/:sessionId/send-message', sendMessage);
router.put('/coach/:sessionId/resolve', resolveSession);

export default router;