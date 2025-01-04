import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  personalityType: { type: String, required: true },
  challenge: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model('Challenge', challengeSchema);