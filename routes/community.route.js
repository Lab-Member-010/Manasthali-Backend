import express from 'express';
import { getAllCommunities, getCommunityDetails, getGroupsInCommunity, createCommunity } from '../controller/community.controller.js';
import {auth} from "../middleware/auth.js";
const router = express.Router();

router.get('/communities',auth , getAllCommunities);
router.get('/communities/:id',auth , getCommunityDetails);
router.get('/communities/:id/groups',auth , getGroupsInCommunity);
router.post('/create',auth , createCommunity);

export default router;