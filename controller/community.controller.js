import Community from '../model/community.model.js'; 
import Group from '../model/group.model.js'; 

// Get all communities
export const getAllCommunities = async (req, res) => {
  // Logic to fetch all communities
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get community details
export const getCommunityDetails = async (req, res) => {
  // Logic to fetch community details by ID
  try {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.status(200).json(community);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get groups in community
export const getGroupsInCommunity = async (req, res) => {
  // Logic to fetch groups in a community
  try {
    const { id } = req.params;
    const groups = await Group.find({ communityId: id });
    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'No groups found in this community' });
    }
    res.status(200).json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a new community
export const createCommunity = async (req, res) => {
  // Logic to create a new community
  const { communityId, name, description, icon, personality_type, created_by } = req.body;

  // Check for duplicate community name
  const existingCommunity = await Community.findOne({ name });
  if (existingCommunity) {
    return res.status(400).json({ message: 'Community with that name already exists' });
  }

  try {
    const newCommunity = new Community({ communityId, name, description, icon, personality_type, created_by });
    await newCommunity.save();
    res.status(201).json(newCommunity);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};