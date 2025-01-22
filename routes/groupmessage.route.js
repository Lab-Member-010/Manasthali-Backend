import express from 'express';
import {
  sendGroupMessage,
  getGroupMessages,
  markGroupMessageAsRead,
} from '../controller/groupmessage.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Send group message
router.post('/send', auth, sendGroupMessage);

// Get messages for a group
router.get('/:groupId', auth, getGroupMessages);

// Mark group message as read
router.post('/read', auth, markGroupMessageAsRead);

export default router;
