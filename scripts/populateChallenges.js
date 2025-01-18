import mongoose from "mongoose";
import {ChallengesFile} from "../model/challengesFile.model.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const populateChallenges = async () => {
  try {
    // Read challenges from the text file located in the same folder
    const challengesData = JSON.parse(
      fs.readFileSync("challenges.txt", "utf-8")
    );

    // Transform the data into the ChallengesFile schema format
    const personalityTypes = Object.entries(challengesData).map(([key, value]) => ({
      type: key,
      dares: value.dares,
    }));

    // Clear existing data to avoid duplicates
    await ChallengesFile.deleteMany({});

    // Insert the new data
    await ChallengesFile.create({ personalityTypes });

    console.log("Challenges successfully populated!");
  } catch (error) {
    console.error("Error populating challenges:", error);
  } finally {
    mongoose.disconnect();
  }
};

populateChallenges();
