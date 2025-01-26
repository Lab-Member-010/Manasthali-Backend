import {Message} from "../model/message.model.js"

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    // Basic validation
    if (!receiverId || !message) {
      return res.status(400).json({ error: "Receiver ID and message are required" });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort by createdAt field for proper order

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found' });
    }

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to mark this message as read" });
    }
    if (message.read) {
      return res.status(400).json({ message: "Message is already marked as read" });
    }
    message.read = true;
    await message.save();
    res.status(200).json({ message: "Message marked as read", messageDetails: message });
  } catch (err) {
    console.error("Error marking message as read:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
