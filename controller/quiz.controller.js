import {Quiz} from '../model/quiz.model.js';
import { User } from '../model/user.model.js';

// submit quiz results
export const submitQuiz = async (req, res) => {
  // Logic to save quiz answers and calculate personality type
};

// get quiz results
export const getQuizResult = async (req, res) => {
  // Logic to fetch quiz result by user ID
};

// Add Personality Type from Quiz to User
export const addPersonalityType = async (req, res) => {
  try {
      const userId = req.user.payload;
      const { quizId } = req.body; 
      const quiz = await Quiz.findById(quizId);
      
      if (!quiz) {
          return res.status(404).json({ error: "Quiz not found" });
      }
      
      const { personality_type } = quiz;
      
      const user = await User.findById(userId);
      
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      
      user.personality_type = personality_type; 
      
      await user.save();
      
      return res.status(200).json({
          message: "Personality type added to user successfully",
          personality_type: user.personality_type
      });
  } catch (err) {
      console.error("Error in addPersonalityType:", err);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};