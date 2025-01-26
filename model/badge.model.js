import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {type:String, required:true},
  icon: {type:String, required:false},
  criteria: {type:String, required:false}
}, {
  timestamps: true
});

export default mongoose.model('Badge', badgeSchema);