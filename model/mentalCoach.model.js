import mongoose from 'mongoose';

const mentalCoachSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User  ' },
  coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User  ' },
  topic: String,
  conversation: [{
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  resolution_status: { type: String, enum: ['open', 'resolved'] },
  creation_date: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
});

export default mongoose.model('MentalCoach', mentalCoachSchema);