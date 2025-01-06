import express from 'express';
import { uploadStory, getUserStories, deleteStory, getAllStories,
    getStoryByID,StoryLike,CommentStory,viewStory
 } from '../controller/story.controller.js';

const router = express.Router();
router.post('/stories', uploadStory);
router.get("/stories",getAllStories )
router.get('/:id', getStoryByID);
router.get('/stories/user/:userId', getUserStories);
router.delete('/stories/:id', deleteStory);
router.post("/stories/like/:id",StoryLike);
router.post("/stories/comment/:id",CommentStory);
router.post("/stories/:id/views",viewStory);

export default router;