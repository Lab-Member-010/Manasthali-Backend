import express from 'express';
import { getAllCommunities, getCommunityDetails, getGroupsInCommunity, createCommunity } from '../controller/community.controller.js';

const router = express.Router();

router.get('/communities', getAllCommunities);
router.get('/communities/:id', getCommunityDetails);
router.get('/communities/:id/groups', getGroupsInCommunity);
router.post('/communities', createCommunity);

export default router;