import express from 'express';
import upload from '../middleware/uploadsdb.js';
import { auth } from '../middleware/auth.js';

import { createPost, getPostDetails, updatePost, deletePost, likePost, unlikePost, getPostComments, sharePost, getAllPosts } from '../controller/post.controller.js';

const router = express.Router();

router.post('/posts',auth, upload.array('media', 5),createPost);
router.get('/posts/:id',auth, getPostDetails);
router.put('/posts/:id',auth, updatePost);
router.delete('/posts/:id',auth, deletePost);
router.post('/posts/:id/like',auth, likePost);
router.post('/posts/:id/unlike',auth, unlikePost);
router.get('/posts/:id/comments',auth, getPostComments);
router.post('/posts/:id/share', auth,sharePost);
router.get('/all-posts/:id',auth,getAllPosts);

export default router;