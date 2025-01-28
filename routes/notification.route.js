// import express from 'express';
// import {sendNotification, getUserNotifications, markNotificationAsRead } from '../controller/notification.controller.js';
// import { auth } from '../middleware/auth.js';
// const router = express.Router();
// router.post('/notifications/send',auth,sendNotification);
// router.get('/:userId',auth, getUserNotifications);
// router.put('/:id/mark-read',auth, markNotificationAsRead);

// export default router;


import express from 'express';
import {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
} from '../controller/notification.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Route to send a notification
router.post('/notifications/send', auth, sendNotification);

// Route to fetch all notifications for a specific user
router.get('/:userId/notifications', auth, getUserNotifications);

// Route to mark a specific notification as read
router.patch('/notifications/:id/mark-read', auth, markNotificationAsRead);

export default router;
