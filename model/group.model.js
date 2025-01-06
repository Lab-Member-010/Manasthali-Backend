import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' }
}, {
  timestamps: true
});

export default mongoose.model('Group', groupSchema);