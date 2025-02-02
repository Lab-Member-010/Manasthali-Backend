import express from 'express';
import {
  sendNotification,
  getUserNotifications,
  
} from '../controller/notification.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Route to send a notification
router.post('/notifications',auth,sendNotification);

// Route to fetch all notifications for a specific user
router.get('/notifications/:userId', auth, getUserNotifications);


// Route to mark a specific notification as read
 
export default router;
