import Group from '../model/group.model.js';
import Community from '../model/community.model.js';

// Create a new group
export const createGroup = async (req, res) => {
  const { name, description, members, communityId } = req.body;

  // Check if user is authenticated (req.user is populated by the auth middleware)
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const createdBy = req.user.id; // Get user ID from decoded token

  // Check if community exists (if a communityId is provided)
  if (communityId) {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(400).json({ message: "Community not found" });
    }
  }

  // Check for duplicate group name
  const existingGroup = await Group.findOne({ name });
  if (existingGroup) {
    return res.status(400).json({ message: "Group with that name already exists" });
  }

  try {
    const newGroup = new Group({ name, description, createdBy, members, communityId });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get group details
export const getGroupDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id)
      .populate('communityId')
      .populate('members', 'name email'); // Populate member details

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update group details
export const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, description, communityId } = req.body;

  try {
    const group = await Group.findById(id);

    // Authorization check: Make sure the user is the creator or admin
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You are not the creator of this group" });
    }

    const updatedGroup = await Group.findByIdAndUpdate(id, { name, description, communityId }, { new: true });
    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(updatedGroup);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a group
export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);

    // Authorization check: Make sure the user is the creator or admin
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You are not the creator of this group" });
    }

    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ message: 'Group deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Join a group
export const joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Add the user to the group members list if not already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    group.members.push(userId);
    await group.save();
    res.status(200).json({ message: 'Successfully joined the group', group });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Leave a group
export const leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is already a member before attempting to leave
    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: 'You are not a member of this group' });
    }

    group.members = group.members.filter(memberId => memberId.toString() !== userId.toString());
    await group.save();
    res.status(200).json({ message: 'Successfully left the group', group });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get group members
export const getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id).populate('members', 'name email');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ members: group.members });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
