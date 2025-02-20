import express from 'express';
import { getAllCommunities, getCommunityDetails, getGroupsInCommunity, createCommunity, getCommunities } from '../controller/community.controller.js';
import {auth} from "../middleware/auth.js";
const router = express.Router();

router.get('/view',auth , getAllCommunities);
router.get('/viewAll', getCommunities);
router.get('/communities/:id',auth , getCommunityDetails);
router.get('/communities/:id/groups',auth , getGroupsInCommunity);
router.post('/create',createCommunity);

export default router;