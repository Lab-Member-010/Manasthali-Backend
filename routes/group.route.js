import express from 'express';
import { createGroup, getGroupDetails, updateGroup, deleteGroup, joinGroup, leaveGroup, getGroupMembers } from '../controller/group.controller.js';

const router = express.Router();

router.post('/groups', createGroup);
router.get('/groups/:id', getGroupDetails);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);
router.post('/groups/:id/join', joinGroup);
router.post('/groups/:id/leave', leaveGroup);
router.get('/groups/:id/members', getGroupMembers);

export default router;