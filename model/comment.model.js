import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User  ' },
  comment: String,
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', optional: true },
  comment_likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User  ' }],
  visibility: { type: String, enum: ['public', 'private', 'followers-only'] },
  creation_date: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);