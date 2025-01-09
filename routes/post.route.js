import express from 'express';
import upload from '../middleware/uploadsdb.js';

import { createPost, getPostDetails, updatePost, deletePost, likePost, unlikePost, getPostComments, sharePost } from '../controller/post.controller.js';

const router = express.Router();

router.post('/posts', upload.array('media', 5),createPost);
router.get('/posts/:id', getPostDetails);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);
router.post('/posts/:id/like', likePost);
router.post('/posts/:id/unlike', unlikePost);
router.get('/posts/:id/comments', getPostComments);
router.post('/posts/:id/share', sharePost);

export default router;