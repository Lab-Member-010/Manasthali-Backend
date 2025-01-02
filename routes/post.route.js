import express from 'express';
import { createPost, getPostDetails, updatePost, deletePost, likePost, unlikePost, getPostComments, sharePost } from './post.controller.js';

const router = express.Router();

router.post('/posts', createPost);
router.get('/posts/:id', getPostDetails);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);
router.post('/posts/:id/like', likePost);
router.post('/posts/:id/unlike', unlikePost);
router.get('/posts/:id/comments', getPostComments);
router.post('/posts/:id/share', sharePost);

export default router;