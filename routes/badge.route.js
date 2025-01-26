import express from 'express';
import { getUserBadges, getTodayBadge } from '../controller/badge.controller.js';

const router = express.Router();

router.get('/badges-all/:userId', getUserBadges);
router.get('/badge-today/:userId', getTodayBadge);

export default router;