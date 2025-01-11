import {User} from "../model/user.model.js"
export const getDailyChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID from token:", userId); // Debugging userId from token

    const user = await User.findById(userId).select("personality_type");
    console.log("User fetched:", user); // Debugging fetched user

    if (!user || !user.personality_type) {
      return res.status(404).json({ error: "User or personality type not found" });
    }

    const personalityType = user.personality_type;
    const challengesFile = await challengesFile.findOne({});
    const typeData = challengesFile.personalityTypes.find((pt) => pt.type === personalityType);

    if (!typeData) {
      return res.status(404).json({ error: "No challenges found for this personality type" });
    }

    const today = new Date();
    const dayOfMonth = today.getDate() % 30 || 30;
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
