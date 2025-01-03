import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
   
  name: {type:String,required:true},
  description: String,
  icon: String,
  criteria: String

}, {
    timestamps: true 
});

export default mongoose.model('Badge', badgeSchema);