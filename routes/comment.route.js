import express from 'express';
import  {auth} from "../middleware/auth.js"
import { addComment, getCommentDetails, updateComment, deleteComment, likeComment } from '../controller/comment.controller.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.post('/comments',auth, addComment);
router.get('/comments/:id',auth, getCommentDetails);
router.put('/comments/:id',auth, updateComment);
router.delete('/comments/:id',auth, deleteComment);
router.post('/comments/:id/like',auth, likeComment);

export default router;