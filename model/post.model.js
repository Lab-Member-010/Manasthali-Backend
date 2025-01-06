import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  media: [{ type: String, required: true }],
  description: String,
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comment_count: { type: Number, default: 0 },
  shared_post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', optional: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  location: String,
  shares: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);