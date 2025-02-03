import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String
    },
    token: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", adminSchema);