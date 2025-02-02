import Notification from '../model/notification.model.js';
 
export const sendNotification=async(req,res,next)=>{
  try {
    const { userId, notification_type, sender_id} = req.body;
    console.log("Notification Data:", req.body); 

    const notification = new Notification({
      userId, notification_type, sender_id,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).send('Error creating notification');
  }
}
 
export const getUserNotifications = async (req, res) => {
  try {
    console.log("Request received:", req.params);   
    const { userId } = req.params;  
    console.log("Extracted userId:", userId);   
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const notifications = await Notification.find({sender_id:userId});
    console.log("Fetched Notifications:", notifications);   
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Error fetching notifications");
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