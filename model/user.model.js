import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
    },
    profile_picture: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    follow_requests: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    gender: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    age: {
      type: Number,
    },
    personality_type: {
      type: String
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    privacy_settings: {
      profile_visibility: {
        type: String,
        enum: ["public", "private"],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);