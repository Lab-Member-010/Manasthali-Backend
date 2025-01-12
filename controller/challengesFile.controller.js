import { User } from "../model/user.model.js";
import {ChallengesFile} from "../model/challengesFile.model.js";  // Make sure to import your ChallengesFile model

export const getDailyChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID from token:", userId); // Debugging userId from token

    // Fetch user and select only personality_type field
    const user = await User.findById(userId).select("personality_type");
    console.log("User fetched:", user); // Debugging fetched user

    if (!user || !user.personality_type) {
      return res.status(404).json({ error: "User or personality type not found" });
    }

    const personalityType = user.personality_type;

    // Fetch the challenges file, ensuring it is not null
    const challengesFile = await ChallengesFile.findOne({});
    if (!challengesFile || !challengesFile.personalityTypes) {
      return res.status(404).json({ error: "Challenges file not found or missing personality types" });
    }

    // Find the challenge data for the current user's personality type
    const typeData = challengesFile.personalityTypes.find((pt) => pt.type === personalityType);

    if (!typeData) {
      return res.status(404).json({ error: "No challenges found for this personality type" });
    }

    // Get today's challenge based on the day of the month (mod 30 for cyclic days)
    const today = new Date();
    const dayOfMonth = today.getDate() % 30 || 30; // Ensure day wraps around after 30
    const todayChallenge = typeData.dares.find((dare) => dare.day === dayOfMonth);

    if (!todayChallenge) {
      return res.status(404).json({ error: "No challenge found for today" });
    }

    // Send the challenge as a response
    res.status(200).json({
      message: "Today's challenge fetched successfully",
      challenge: todayChallenge.challenge,
    });
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
