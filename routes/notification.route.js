import express from 'express';
import {sendNotification, getUserNotifications, markNotificationAsRead } from '../controller/notification.controller.js';

const router = express.Router();
router.post('/notifications/send',sendNotification);
router.get('/:userId', getUserNotifications);
router.put('/:id/mark-read', markNotificationAsRead);

export default router;