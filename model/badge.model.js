import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
    badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        auto: true     
    },
  name: {type:String,required:true},
  description: String,
  icon: String,
  criteria: String

}, {
    timestamps: true 
});

export default mongoose.model('Badge', badgeSchema);