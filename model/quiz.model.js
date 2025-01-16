import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [{ type: Number }],
  scores: {
    E_I: Number,
    S_N: Number,
    T_F: Number,
    J_P: Number,
  },
  personality_type: String,
  result_date: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export const Quiz = mongoose.model("Quiz", quizSchema);
