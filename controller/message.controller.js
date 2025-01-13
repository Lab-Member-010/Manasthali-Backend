import { Message } from '../model/message.model.js';

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

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

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.read = true;
    await message.save();
    res.status(200).json({ message: 'Message marked as read' });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};