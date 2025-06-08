import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { myOPT, sendEmail } from "../mailer/mymail.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Sign-up
export const SignUp = async (request, response, next) => {
  try {
    // Validate request data
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return response.status(400).json({ error: "Bad request", details: errors.array() });
    }

    // Destructure user data from request body
    const { email, password, username, contact, dob, gender } = request.body;

    // Check if the email already exists in the database
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      console.error(`Email already exists: ${email}`);
      return response.status(409).json({ error: "Email already exists" });
    }

    // Check if the username already exists in the database
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      console.error(`Username already exists: ${username}`);
      return response.status(409).json({ error: "Username already taken" });
    }

    // Generate OTP
    const otp = myOPT(email);

    // Encrypt password
    const saltKey = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, saltKey);

    const user = new User({
      email,
      username,
      contact,
      dob,
      gender,
      password: encryptedPassword,
      otp,
      verified: false,
    });

    await user.save();

    return response.status(201).json({
      message: "Sign up successful. OTP sent to your email.",
      user: { id: user.id, email: user.email, username: user.username },
    });

  } catch (err) {
    console.error("Unexpected error during SignUp process:", err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, otp });
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    user.verified = true;
    user.otp = null;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully. Your account is now active." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Send reset instructions to the user's email
    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manasthali - Password Reset</title>
  <style>
    /* General styles for the email */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px;
      background-color: #8e24aa; /* Purple background */
      color: white;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    .content p {
      margin-bottom: 20px;
    }
    .reset-button {
      display: block;
      width: 100%;
      max-width: 200px;
      margin: 20px auto;
      padding: 10px;
      color: white;
      background-color: #8e24aa; /* Purple button */
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .reset-button:hover {
      background-color: #8e24aa; /* Darker purple on hover */
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      margin-top: 30px;
    }
    .footer p {
      margin: 5px 0;
    }
    .footer a {
      color: #6a1b9a;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>

    <!-- Email Content -->
    <div class="content">
      <p>Hi there,</p>
      <p>We received a request to reset your password for your account on Manasthali. If you did not make this request, please ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      
      <!-- Reset Button -->
      <a href="${resetLink}" style="color:white;" class="reset-button" target="_blank">Reset Password</a>

      <p>This link is valid for 1 hour. After that, the reset link will expire for security reasons.</p>
      <p>If you need further assistance, feel free to <a href="mailto:${process.env.MAIL_USER}">contact our support team</a>.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Thank you for being part of Manasthali.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Manasthali, Your Community, Your Connection.</p>
      <p>© 2025 Manasthali. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

    `;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: htmlContent,
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const saltKey = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, saltKey);

    user.password = encryptedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Sign-in
export const SignIn = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (user) {
      if (!user.verified) {
        return response.status(401).json({ error: "Please verify your account before logging in." });
      }

      const status = bcrypt.compareSync(password, user.password);
      if (status) {
        return response.status(200).json({
          message: "Sign in success.",
          user,
          token: generateToken(user._id),
        });
      } else {
        return response.status(401).json({ error: "Invalid password" });
      }
    } else {
      return response.status(401).json({ error: "Invalid email ID" });
    }
  } catch (err) {
    console.error("Error in SignIn:", err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// generate json webtoken
const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET;
  let token = jwt.sign({ payload: userId }, secretKey);
  return token;
};

// get user details
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// update user details
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile_picture = req.file ? req.file.path : null;
    const updateData = {
      ...req.body,
      ...(profile_picture && { profile_picture }),
    };
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

};

// contact update
export const contactUpdateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contact } = req.body;

    if (!contact) {
      return res.status(400).json({ message: "Contact is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { contact },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// dob update
export const DobUpdateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dob } = req.body;

    if (!dob) {
      return res.status(400).json({ message: "Date of Birth is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { dob },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Date of Birth updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// gender update
export const genderUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gender } = req.body;

    if (!gender) {
      return res.status(400).json({ message: "Gender is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { gender },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Gender updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// delete user
export const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "username profile_picture");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ followers: user.followers || [] });
  } catch (err) {
    console.error("Error fetching followers:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch following users with username and profile picture
export const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username profile_picture"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ following: user.following || [] });
  } catch (err) {
    console.error("Error fetching following users:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// folllow user
export const followUser = async (req, res) => {
  try {
    const { userId, userIdToFollow } = req.body;

    if (userId === userIdToFollow) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(userIdToFollow);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(userIdToFollow)) {
      return res.status(409).json({ message: "You already follow this user" });
    }

    // Add to the user's following list
    user.following.push(userIdToFollow);
    await user.save();

    // Add to the target user's followers list
    targetUser.followers.push(userId);
    await targetUser.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const { userId, userIdToUnfollow } = req.body;  // Extract IDs correctly

    if (!userId || !userIdToUnfollow) {
      return res.status(400).json({ error: "Invalid request. Missing user ID." });
    }

    if (userId === userIdToUnfollow) {
      return res.status(400).json({ error: "You cannot unfollow yourself." });
    }

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(userIdToUnfollow);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userIdToUnfollow
    );
    await currentUser.save();

    // Remove from followers list
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId
    );
    await targetUser.save();

    return res.status(200).json({ message: "Unfollowed successfully" });

  } catch (err) {
    console.error("Error unfollowing user:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all users except you
export const getAllUsersExceptOne = async (req, res) => {
  try {
    const excludedId = req.params.id; // Assuming you pass the ID of the user to exclude
    const users = await User.find({ _id: { $ne: excludedId } });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, could not retrieve users",
    });
  }
};

// update bio
export const bioUpdateById = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from params
    const { bio } = req.body;  // Extract bio from request body

    // Check if bio is provided
    if (!bio) {
      return res.status(400).json({ message: "Bio is required" });
    }

    // Update the user's bio
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },              // Find the user by ID
      { bio: bio },             // Update the bio field
      { new: true }             // Return the updated user document
    );

    // If the user is not found
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user with success message
    return res.status(200).json({
      success: true,
      message: "Bio updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//get dm list
export const getDMList = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .populate('followers following', 'username profile_picture');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the list of followers (users who follow the current user)
    const followers = user.followers;

    // Get the list of following (users the current user is following)
    const following = user.following;

    // Combine followers and following lists, removing duplicates (users who are both following and followers)
    const combinedList = [
      ...followers,
      ...following.filter(followedUser => !followers.some(f => f._id.toString() === followedUser._id.toString())),
    ];

    // Remove the current user from the list if they appear
    const dmList = combinedList.filter(user => user._id.toString() !== id);

    // Send the DM list to the client
    res.json(dmList);
  } catch (error) {
    console.error('Error fetching DM list:', error);
    res.status(500).json({ error: 'Internal Server error' });
  }
};

// check email
export const checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ available: false, message: "Email already exists." });
    }
    return res.status(200).json({ available: true });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// check username
export const checkUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ available: false, message: "Username already exists." });
    }
    return res.status(200).json({ available: true });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// get community users
export const getCommunityUsers = async (req,res,next) => {
  try {
    const userId = req.params.id;
    const user=await User.findOne({_id:userId});
    const users = await User.find({personality_type:user.personality_type});
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    return res.status(200).json({users});
  } catch (error) {
    return res.status(500).json({error});
  }
};