import express from 'express';
import { uploadStory, getStoryDetails, getUserStories, deleteStory } from '../controller/story.controller.js';

const router = express.Router();

router.post('/stories', uploadStory);
router.get('/stories/:id', getStoryDetails);
router.get('/stories/user/:userId', getUserStories);
router.delete('/stories/:id', deleteStory);

export default router;