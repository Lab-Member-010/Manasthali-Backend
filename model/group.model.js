import mongoose from 'mongoose';

const groupMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [groupMessageSchema],
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' }
}, {
  timestamps: true
});

export const Group = mongoose.model('Group', groupSchema);
export  default mongoose.model('GroupMessage', groupMessageSchema);