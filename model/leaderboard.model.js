import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  type: String,
  rankings: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User  ' },
    points: Number,
    rank: Number
  }],
  creation_date: { type: Date, default: Date.now }
});

export default mongoose.model('Leaderboard', leaderboardSchema);