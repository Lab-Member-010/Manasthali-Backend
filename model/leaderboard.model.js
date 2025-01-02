import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
    leaderboardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        auto: true     
    },
 durationtype: String,//eg weekly,monthly
  rankings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    points: Number,
    rank: Number
  }],
}, {
    timestamps: true 
});

export default mongoose.model('Leaderboard', leaderboardSchema);