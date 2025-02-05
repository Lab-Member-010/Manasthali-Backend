import express from 'express';
import { createGroup, getGroups, getGroupDetails, updateGroup, deleteGroup, joinGroup, leaveGroup, getGroupMembers, getJoinedGroups} from '../controller/group.controller.js';
import {auth} from "../middleware/auth.js"
const router = express.Router();

router.post('/create', createGroup);
router.get("/get-groups/:personality_type", getGroups);
router.get('/groups/:id',auth, getGroupDetails);
router.put('/groups/:id',auth, updateGroup);
router.delete('/groups/:id',auth, deleteGroup);
router.post('/groups/:id/join',auth, joinGroup);
router.post('/groups/:id/leave',auth, leaveGroup);
router.get('/groups/:id/members',auth, getGroupMembers);
router.get("/view/joinedList",auth,getJoinedGroups);
 

export default router;