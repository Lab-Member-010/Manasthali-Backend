import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }],
  community_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  creation_date: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
});

export default mongoose.model('Group', groupSchema);