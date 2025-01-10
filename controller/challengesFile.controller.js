import ChallengesFile from "../model/challangesFile.model.js";
import {User} from "../model/user.model.js";

// Fetch today's challenge for the logged-in user
export const getDailyChallenge = async (req, res) => {
  try {
    // Extract user ID from request (assumes authentication middleware)
    const userId = req.user._id;

    // Fetch the user's personality type
    const user = await User.findById(userId);
    if (!user || !user.personality_type) {
      return res.status(404).json({ error: "User or personality type not found" });
    }
    const personalityType = user.personality_type;

    // Fetch the challenges for the user's personality type
    const challengesFile = await ChallengesFile.findOne({});
    const typeData = challengesFile.personalityTypes.find(
      (pt) => pt.type === personalityType
    );

    if (!typeData) {
      return res.status(404).json({ error: "No challenges found for this personality type" });
    }

    // Determine today's day number (1-30)
    const today = new Date();
    const dayOfMonth = today.getDate() % 30 || 30;

    // Find today's challenge
    const todayChallenge = typeData.dares.find((dare) => dare.day === dayOfMonth);

    if (!todayChallenge) {
      return res.status(404).json({ error: "No challenge found for today" });
    }

    res.status(200).json({
      message: "Today's challenge fetched successfully",
      challenge: todayChallenge.challenge,
    });
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
