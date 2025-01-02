import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User  ' },
  media: [String],
  description: String,
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User  ' }],
  comment_count: { type: Number, default: 0 },
  visibility: { type: String, enum: ['public', 'private', 'followers-only'] },
  shared_post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', optional: true },
  community_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  location: String,
  creation_date: { type: Date, default: Date.now },
  edit_date: { type: Date, default: Date.now },
  shares: { type: Number, default: 0 }
});

export default mongoose.model('Post', postSchema);