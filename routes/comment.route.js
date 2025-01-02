import express from 'express';
import { addComment, getCommentDetails, updateComment, deleteComment, likeComment } from './comment.controller.js';

const router = express.Router();

router.post('/comments', addComment);
router.get('/comments/:id', getCommentDetails);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);
router.post('/comments/:id/like', likeComment);

export default router;