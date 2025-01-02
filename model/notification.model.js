import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User  ' },
  type: String,
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User  ' },
  content: String,
  read_status: { type: Boolean, default: false },
  creation_date_time: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);