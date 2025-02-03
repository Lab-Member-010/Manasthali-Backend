import Community from '../model/community.model.js';

// Get all communities
export const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find(); // Fetches all communities from the database
        return res.status(200).json({ success: true, data: communities });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch communities" });
    }
};

// Get details of a specific community
export const getCommunityDetails = async (req, res) => {
    const { id } = req.params; // The community ID is passed in the URL

    try {
        const community = await Community.findById(id); // Find community by ID
        if (!community) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }
        return res.status(200).json({ success: true, data: community });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch community details" });
    }
};

// Get all groups in a specific community (assuming there is a `Group` model associated with `Community`)
export const getGroupsInCommunity = async (req, res) => {
    const { id } = req.params;

    try {
        // Assuming you have a separate Group model where each group references the community by communityId
        const groups = await Group.find({ communityId: id }); // Fetch all groups in the given community
        if (!groups) {
            return res.status(404).json({ success: false, message: "No groups found in this community" });
        }
        return res.status(200).json({ success: true, data: groups });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch groups in community" });
    }
};

// Create a new community
export const createCommunity = async (req, res) => {
    const { name, description, personality_type } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Community name is required" });
    }

    try {
        const newCommunity = new Community({
            name,
            description,
            personality_type
        });

        const savedCommunity = await newCommunity.save();
        return res.status(201).json({ success: true, data: savedCommunity });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to create community" });
    }
};

// Get all communities
export const getCommunities = async (req, res) => {
    try {
        const communities = await Community.find();
        return res.status(200).json({ success: true, data: communities });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch communities" });
    }
};