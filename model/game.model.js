import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  questions: [{
    question: String,
    options: [String]
  }],
  creation_date: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
});

export default mongoose.model('Game', gameSchema);