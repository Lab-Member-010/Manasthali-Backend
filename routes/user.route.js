import express from "express";
import {
  SignUp,
  SignIn,
  getUserById,
  updateUserById,
  contactUpdateById,
  DobUpdateById,
  genderUpdate,
  bioUpdateById,
  deleteUserById,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
  verifyOtp,
  forgotPassword,
  resetPassword,getAllUsersExceptOne
} from "../controller/user.controller.js";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import upload from '../middleware/uploadsdb.js';

const router = express.Router();

// Register a new user
router.post(
  "/register",
  body("username", "Username is required").notEmpty(),
  body("email", "Invalid email ID").isEmail(),
  body("email", "Email ID is required").notEmpty(),
  body("password", "Password is required").notEmpty(),
  SignUp
);

// Verify OTP
router.post("/verify-otp", 
  body("email", "Invalid email ID").isEmail(),
  body("otp", "OTP is required").notEmpty(),
  verifyOtp
);

// Authenticate and log in a user
router.post("/login", SignIn);

// Forgot password
router.post("/forgot-password", 
  body("email", "Invalid email ID").isEmail(),
  forgotPassword
);

// Reset password
router.post("/reset-password", 
  body("token", "Token is required").notEmpty(),
  body("newPassword", "New password is required").notEmpty(),
  resetPassword
);

// Get user details by ID
router.get("/:id", auth, getUserById);

//Get all user
// router.get("/viewuser",auth,getalluser)
router.get("/get-all-users-except/:id",auth,getAllUsersExceptOne);

// Update user details
router.put("/:id", auth,upload.single("profile_picture"), updateUserById);

// Update user contact
router.put("/:id/contact",auth,contactUpdateById)

// Update user DOB
router.put("/:id/dob",auth,DobUpdateById);


router.put("/:id/bio",auth,bioUpdateById);
// Update user gender
router.put("/:id/gender",auth,genderUpdate);
// Delete a user account
router.delete("/:id", auth, deleteUserById);

// Get followers of a user
router.get("/:id/followers", auth, getUserFollowers);

// Get users that the user is following
router.get("/:id/following", auth, getUserFollowing);

// Follow a user
router.post("/follow", auth, followUser);

// Unfollow a user
router.post("/unfollow", auth, unfollowUser);

// get all users
router.get("/get-all-users-except/:id",auth,getAllUsersExceptOne);

export default router;
