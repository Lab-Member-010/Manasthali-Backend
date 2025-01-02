import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  personality_type: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
  group_count: { type: Number, default: 0 },
  creation_date: { type: Date, default: Date.now }
});

export default mongoose.model('Community', communitySchema);