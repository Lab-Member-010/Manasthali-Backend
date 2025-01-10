import mongoose from "mongoose";

const dareSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    challenge: { type: String, required: true },
  },
  { _id: false }
);

const personalityTypeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    dares: [dareSchema],
  },
  { timestamps: true }
);

const challengesFileSchema = new mongoose.Schema({
  personalityTypes: [personalityTypeSchema],
});

export default mongoose.model("ChallengesFile", challengesFileSchema);
