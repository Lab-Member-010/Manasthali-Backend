import Notification from '../model/notification.model.js';

export const sendNotification=async(req,res,next)=>{
    try {
      const { userId, sender_id, type, content } = req.body;   
       const notification = new Notification({ userId, sender_id, type, content });
      const savedNotification = await notification.save();
      res.status(200).json({ message:"Notification sent successfully", notification: savedNotification });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sending notification', error });
    }
}

// Get notifications for a user
export const getUserNotifications = async (req, res) => {
  // Logic to fetch notifications for a user
  const { userId } = req.params;
  console.log('User ID:', userId);
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // Latest notifications first
      .exec();

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found for this user' });
    }
    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

 

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  // Logic to mark a notification as read
  try{
const{id}=req.params;
const notification=await Notification.findById(id);
if(!notification){
  res.status(400).json({message:"notification not found"})
}
notification.read_status=true;
await notification.save();
res.status(200).json({message:'Notification marked as read', notification});
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};