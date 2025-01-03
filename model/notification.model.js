import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: {type:String,required:true},
  read_status: { type: Boolean, default: false }
}, {
    timestamps: true 
});

export default mongoose.model('Notification', notificationSchema);