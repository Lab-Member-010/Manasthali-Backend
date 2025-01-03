import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        auto: true     
    },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', optional: true },
  comment_likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  visibility: { type: String, enum: ['public', 'private', 'followers-only'] }
}, {
    timestamps: true 
});

export default mongoose.model('Comment', commentSchema);