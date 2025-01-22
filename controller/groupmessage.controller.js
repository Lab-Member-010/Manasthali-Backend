import GroupMessage from '../model/group.model.js';

// Function to send a group message
export const sendGroupMessage = async (req, res) => {
  const { groupId, message } = req.body;

  try {
    const newMessage = await GroupMessage.create({
      sender: req.user._id,
      group: groupId,
      message,
    });
    res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: "Couldn't send message" });
  }
};

// Function to get group messages
export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await GroupMessage.find({ group: groupId }).populate('sender').sort({ createdAt: -1 });
    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ error: "Couldn't fetch messages" });
  }
};

// Function to mark a group message as read
export const markGroupMessageAsRead = async (req, res) => {
  const { messageId } = req.body;

  try {
    const message = await GroupMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    message.readBy.push(req.user._id);
    await message.save();
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: "Couldn't mark message as read" });
  }
};
