import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User   ' },
  media: [String],
  caption: String,
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User   ' }],
  upload_date_time: { type: Date, default: Date.now },
  end_date_time: { type: Date }
});

export default mongoose.model('Story', storySchema);