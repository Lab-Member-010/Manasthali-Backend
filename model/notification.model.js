import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notification_type:  { type: String, enum: ['like', 'comment'] },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read_status: { type: Boolean, default: false }
}, {
  timestamps: true
});
export default mongoose.model('Notification', notificationSchema);