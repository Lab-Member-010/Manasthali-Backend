import express from "express";
import {
  SignUp,
  SignIn,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser
} from "../controller/user.controller.js";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Register a new user
router.post(
  "/register",
  body("username", "Username is required").notEmpty(),
  body("email", "Invalid email ID").isEmail(),
  body("email", "Email ID is required").notEmpty(),
  body("password", "Password is required").notEmpty(),
  body("contact", "Only digits are allowed in contact").isNumeric(),
  SignUp
);

// Authenticate and log in a user
router.post("/login", SignIn);

// Get user details by ID
router.get("/:id", auth, getUserById);

// Update user details
router.put("/:id", auth, updateUserById);

// Delete a user account
router.delete("/:id", auth, deleteUserById);

// Get followers of a user
router.get("/:id/followers", auth, getUserFollowers);

// Get users that the user is following
router.get("/:id/following", auth, getUserFollowing);

// Follow a user
router.post("/:id/follow", auth, followUser);

// Unfollow a user
router.post("/:id/unfollow", auth, unfollowUser);

export default router;