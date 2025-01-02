import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  criteria: String,
  creation_date: { type: Date, default: Date.now }
});

export default mongoose.model('Badge', badgeSchema);