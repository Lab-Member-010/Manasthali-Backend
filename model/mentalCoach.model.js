import mongoose from 'mongoose';

const mentalCoachSchema = new mongoose.Schema({
   
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: String,
  conversation: [{
    sender:{type: String,required:true},
    message:{type: String,required:true},
    timestamp: { type: Date, default: Date.now }
  }],
  resolution_status: { type: String, enum: ['open', 'resolved']}
 
}, {
    timestamps: true 
});

export default mongoose.model('MentalCoach', mentalCoachSchema);