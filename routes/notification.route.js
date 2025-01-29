import express from 'express';
import {sendNotification, getUserNotifications, markNotificationAsRead } from '../controller/notification.controller.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();
router.post('/notifications/send/:notification_type',auth,sendNotification);
router.get('/:userId',auth, getUserNotifications);
router.put('/:id/mark-read',auth, markNotificationAsRead);

export default router;