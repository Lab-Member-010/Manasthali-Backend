import express from 'express';
import { getUserNotifications, markNotificationAsRead } from '../controller/notification.controller.js';

const router = express.Router();

router.get('/notifications/:userId', getUserNotifications);
router.put('/notifications/:id/mark-read', markNotificationAsRead);

export default router;