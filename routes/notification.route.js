import express from 'express';
import {sendNotification, getUserNotifications, markNotificationAsRead } from '../controller/notification.controller.js';

const router = express.Router();
router.post('/notifications/send',sendNotification);
router.get('/notifications/:userId', getUserNotifications);
router.put('/notifications/:id/mark-read', markNotificationAsRead);

export default router;