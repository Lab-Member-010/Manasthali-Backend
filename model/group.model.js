import mongoose from 'mongoose';

// GroupMessage Schema
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
    createdAt: {
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

// Group Schema with `groupIcon` added
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupMessage' }],  // Reference to GroupMessage model
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  groupIcon: { type: String, default: '' },  // Add groupIcon field for the image URL or path
}, {
  timestamps: true
});

// Create models
export const Group = mongoose.model('Group', groupSchema);
export default mongoose.model('GroupMessage', groupMessageSchema);
