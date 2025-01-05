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
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalityType",
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
    // New fields for OTP and password reset
    otp: {
      type: String, // Stores the OTP for email verification
      default: null,
    },
    resetToken: {
      type: String, // Stores the token for password reset
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index for OTP: Automatically expires after 5 minutes
userSchema.index({ otp: 1 }, { expireAfterSeconds: 300 }); 

// TTL Index for Reset Token: Automatically expires after 1 hour
userSchema.index({ resetToken: 1 }, { expireAfterSeconds: 3600 }); 

export const User = mongoose.model("User", userSchema);