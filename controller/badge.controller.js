import Badge from '../model/badge.model.js';
import { User } from '../model/user.model.js';
import { ChallengesFile } from '../model/challengesFile.model.js';

// Get a list of badges earned by a user
export const getUserBadges = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Fetch the badges earned by the user
    const badges = await Badge.find({ userId: userId });
    if (!badges.length) {
      return res.status(404).json({ error: "No badges found for this user" });
    }

    res.status(200).json(badges);
  } catch (error) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get today's badge based on the challenge completion status
export const getTodayBadge = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get the user's personality type
    const user = await User.findById(userId).select('personality_type');
    if (!user || !user.personality_type) {
      return res.status(404).json({ error: "User not found or personality type missing" });
    }

    const personalityType = user.personality_type;
    
    // Fetch the challenge file
    const challengesFile = await ChallengesFile.findOne({});
    if (!challengesFile || !challengesFile.personalityTypes) {
      return res.status(404).json({ error: "Challenges file not found" });
    }

    // Find today's challenge based on the day of the month
    const today = new Date();
    const dayOfMonth = today.getDate() % 30 || 30;
    const typeData = challengesFile.personalityTypes.find((pt) => pt.type === personalityType);
    if (!typeData) {
      return res.status(404).json({ error: "No challenge data found for this personality type" });
    }

    const todayChallenge = typeData.dares.find((dare) => dare.day === dayOfMonth);
    if (!todayChallenge) {
      return res.status(404).json({ error: "No challenge found for today" });
    }

    // Get today's badge by challenge status (either complete or incomplete)
    const badgeName = `${today.toLocaleString('default', { month: 'short' })}${today.getDate()}`;
    const badgeDescription = todayChallenge.challenge;

    // Check if a badge has already been allocated today
    const existingBadge = await Badge.findOne({ userId, name: badgeName });
    if (existingBadge) {
      return res.status(200).json({ message: "Badge already allocated today", badge: existingBadge });
    }

    // Create a new badge for the user
    const newBadge = new Badge({
      name: badgeName,
      description: badgeDescription,
      userId: userId,
    });

    // Save the badge in the database
    await newBadge.save();

    res.status(200).json({ message: "Badge allocated successfully", badge: newBadge });
  } catch (error) {
    console.error("Error allocating badge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
