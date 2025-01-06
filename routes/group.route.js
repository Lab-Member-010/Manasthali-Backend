import express from 'express';
import { createGroup, getGroupDetails, updateGroup, deleteGroup, joinGroup, leaveGroup, getGroupMembers } from '../controller/group.controller.js';
import {auth} from "../middleware/auth.js"
const router = express.Router();

router.post('/create',auth, createGroup);
router.get('/groups/:id',auth, getGroupDetails);
router.put('/groups/:id',auth, updateGroup);
router.delete('/groups/:id',auth, deleteGroup);
router.post('/groups/:id/join',auth, joinGroup);
router.post('/groups/:id/leave',auth, leaveGroup);
router.get('/groups/:id/members',auth, getGroupMembers);

export default router;