import express from 'express';
import { getUserBadges, getAllBadges } from './badge.controller.js';

const router = express.Router();

router.get('/badges/:userId', getUserBadges);
router.get('/badges', getAllBadges);

export default router;