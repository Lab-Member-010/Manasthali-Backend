import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  gameType: String,
  description: String,
  questions: [{
    question: String,
    options: [String]
  }]
}, {
  timestamps: true
});

export default mongoose.model('Game', gameSchema);