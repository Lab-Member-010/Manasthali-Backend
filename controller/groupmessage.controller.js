import GroupMessage ,{Group} from '../model/group.model.js';

// Function to send a group message
export const sendGroupMessage = async (req, res) => {
  const { groupId, message } = req.body;

  try {
    // Check if the group exists and if the user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Create new message
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
    const messages = await GroupMessage.find({ group: groupId })
      .populate('sender') // populate sender details
      .sort({ createdAt: -1 }); // sort messages by creation date in descending order

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

    // Check if the user has already marked this message as read
    if (message.readBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already marked this message as read." });
    }

    message.readBy.push(req.user._id);
    await message.save();
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: "Couldn't mark message as read" });
  }
};
