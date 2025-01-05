import Group from '../model/group.model.js';
import Community from '../model/community.model.js';

// Create a new group
export const createGroup = async (req, res) => {
  // Logic to create a new group
  const { name, description, communityId } = req.body;
  console.log(req.body);
  // Check if user is authenticated (assuming authentication middleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const createdBy = req.user._id; // Get user ID from authentication

  // Check if community exists (if applicable)
  if (communityId) {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(400).json({ message: 'Community not found' });
    }
  }

  // Check for duplicate group name
  const existingGroup = await Group.findOne({ name });
  if (existingGroup) {
    return res.status(400).json({ message: 'Group with that name already exists' });
  }

  try {
    const newGroup = new Group({ name, description, createdBy, communityId });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get group details
export const getGroupDetails = async (req, res) => {
  // Logic to fetch group details by ID
  const { id } = req.params;

  try {
    const group = await Group.findById(id).populate('members createdBy communityId'); // Populate related data
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    handleErrors(err, req, res);
  }
};

// Update group details
export const updateGroup = async (req, res) => {
  // Logic to update group details
  const { id } = req.params;
  const { name, description, communityId } = req.body;

  // Check if user is authorized to update (e.g., creator or admin)

  try {
    const group = await Group.findByIdAndUpdate(id, { name, description, communityId }, { new: true }); // Return updated document
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    handleErrors(err, req, res);
  }
};

// Delete a group
export const deleteGroup = async (req, res) => {
  // Logic to delete a group
  const { id } = req.params;
  // Check if user is authorized to delete (e.g., creator or admin)

  try {
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ message: 'Group deleted' });
  } catch (err) {
    handleErrors(err, req, res);
  }
};

// Join a group
export const joinGroup = async (req, res) => {
  // Logic to join a group
  try {
    const { id } = req.params; // Group ID from the URL
    const userId = req.user._id; // User ID from authentication middleware

    // Find the group by ID
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Add the user to the group members list if not already a member
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ message: 'Successfully joined the group', group });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Leave a group
export const leaveGroup = async (req, res) => {
  // Logic to leave a group
  try {
    const { id } = req.params; // Group ID from the URL
    const userId = req.user._id; // User ID from authentication middleware

    // Find the group by ID
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Remove the user from the group members list
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
// Logic to fetch group members
  try {
    const { id } = req.params; // Group ID from the URL
    // Find the group by ID and populate the members field
    const group = await Group.findById(id).populate('members', 'name email'); // Adjust fields to be populated
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ members: group.members });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};