import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        auto: true     
    },
  personalityType: { type:String,required:true},
  challenge:{type: String,required:true}
}, {
    timestamps: true 
});

export default mongoose.model('Challenge', challengeSchema);