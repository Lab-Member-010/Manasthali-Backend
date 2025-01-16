import { Quiz } from '../model/quiz.model.js';
import { User } from '../model/user.model.js';

// Submit quiz results
export const submitQuiz = async (req, res) => {
  try {
    // Ensure the user is authenticated and that we have their _id
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    const { answers } = req.body;  // Grab answers from the request body
    const userId = req.user._id;  // Get the userId from the auth middleware

    // Calculate scores based on answers
    const scores = calculateScores(answers);

    // Calculate the personality type based on the scores
    const personalityType = getPersonalityType(scores);

    // Store the quiz results in the database
    const quiz = new Quiz({
      userId,
      answers,
      scores,
      personality_type: personalityType,
    });

    await quiz.save();

    // After saving the quiz, update the User profile with the personality type
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.personality_type = personalityType;  // Update personality type in the User model
    await user.save();

    return res.status(200).json({
      message: 'Quiz submitted successfully and personality type set!',
      personality_type: personalityType,
    });
  } catch (error) {
    console.error("Error in submitQuiz:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to calculate scores based on answers
const calculateScores = (answers) => {
  const scores = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };

  // Calculate the scores for each personality trait
  scores.E_I += answers[0] + answers[1] + answers[2] + answers[3]; // Extraversion
  scores.E_I -= answers[16] + answers[17] + answers[18] + answers[19]; // Introversion
  scores.S_N += answers[4] + answers[5] + answers[6] + answers[7]; // Sensing
  scores.S_N -= answers[20] + answers[21] + answers[22] + answers[23]; // Intuition
  scores.T_F += answers[8] + answers[9] + answers[10] + answers[11]; // Thinking
  scores.T_F -= answers[24] + answers[25] + answers[26] + answers[27]; // Feeling
  scores.J_P += answers[12] + answers[13] + answers[14] + answers[15]; // Judging
  scores.J_P -= answers[28] + answers[29] + answers[30] + answers[31]; // Perceiving

  return scores;
};

// Helper function to derive the personality type from scores
const getPersonalityType = (scores) => {
  const personality = [];
  personality.push(scores.E_I > 0 ? 'E' : 'I');
  personality.push(scores.S_N > 0 ? 'S' : 'N');
  personality.push(scores.T_F > 0 ? 'T' : 'F');
  personality.push(scores.J_P > 0 ? 'J' : 'P');
  return personality.join('');
};
