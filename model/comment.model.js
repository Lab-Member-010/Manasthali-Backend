import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },ent_likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  visibility: { type: String, enum: ['public', 'private', 'followers-only'] }
}, {
    timestamps: true 
});

export default mongoose.model('Comment', commentSchema);