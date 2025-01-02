import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
  quiz_attempt: { type: Number, default: 1 },
  answers: [{
    question_id: String,
    answer: Number
  }],
  scores: {
    E_I: Number,
    S_N: Number,
    T_F: Number,
    J_P: Number
  },
  personality_type_result: String,
  community_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  result_date: { type: Date, default: Date.now }
});

export default mongoose.model('Quiz', quizSchema);