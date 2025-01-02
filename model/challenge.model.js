import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  personalityType: String,
  challenge: String,
  creation_date: { type: Date, default: Date.now }
});

export default mongoose.model('Challenge', challengeSchema);