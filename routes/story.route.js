import express from 'express';
import { uploadStory, getUserStories, deleteStory, getAllStories,
    getStoryByID,StoryLike,CommentStory,viewStory
 } from '../controller/story.controller.js';
 import upload from '../middleware/uploadsdb.js';
 import { auth } from '../middleware/auth.js';
const router = express.Router();
// router.post('/stories',auth, uploadStory);
router.post("/stories", auth, upload.single("media"), uploadStory);
router.get("/stories",auth,getAllStories )
router.get('/:id',auth, getStoryByID);
router.get('/stories/user/:userId',auth, getUserStories);
router.delete('/stories/:id',auth, deleteStory);
router.post("/stories/like/:id",auth,StoryLike);
router.post("/stories/comment/:id",auth,CommentStory);
router.post("/stories/:id/views",auth,viewStory);

export default router;