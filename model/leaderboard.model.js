import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  durationtype: String,
  rankings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    points: Number,
    rank: Number
  }],
}, {
  timestamps: true
});

export default mongoose.model('Leaderboard', leaderboardSchema);