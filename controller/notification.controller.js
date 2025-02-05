import Notification from '../model/notification.model.js';

// send notification
export const sendNotification = async (req, res, next) => {
  try {
    const { userId, notification_type, sender_id } = req.body;
    const notification = new Notification({
      receiver_id, notification_type, sender_id,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).send('Error creating notification');
  }
}

// get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const notifications = await Notification.find({ sender_id: userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).send("Error fetching notifications");
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      res.status(400).json({ message: "notification not found" })
    }
    notification.read_status = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};