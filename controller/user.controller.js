import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { myOPT, sendEmail } from "../mailer/mymail.js"; 
import crypto from "crypto";

//sign-up
export const SignUp = async (request, response, next) => {
    try {
        // Validate request body using express-validator
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            console.error("Validation errors:", errors.array());
            return response.status(400).json({ error: "Bad request", details: errors.array() });
        }

        const { email, password, username, contact,dob, gender } = request.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error(`Email already exists: ${email}`);
            return response.status(409).json({ error: "Email already exists" });
        }

        // Generate OTP
        const otp = myOPT(email);

        // Encrypt password
        const saltKey = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(password, saltKey);

        // Create a new user with `verified` set to false
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

        // Return success response
        return response.status(201).json({
            message: "Sign up success. OTP sent to your email.",
            user: { id: user.id, email: user.email, username: user.username }, // Send only safe data
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
    
        // Generate a reset token and set its expiry time
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();
    
        // Send reset instructions to the user's email
        const htmlContent = `
          <p>Your password reset token is:</p>
          <h2>${token}</h2>
          <p>Please use this token in the reset password form to reset your password. The token is valid for 1 hour.</p>
        `;
    
        await sendEmail({
          to: email,
          subject: "Password Reset",
          html: htmlContent,
        });
    
        res.status(200).json({ message: "Password reset token sent to your email" });
      } catch (err) {
        console.error("Error in forgotPassword:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }  
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
    
        // Find the user with the provided reset token and ensure it is not expired
        const user = await User.findOne({
          resetToken: token,
          resetTokenExpiry: { $gt: Date.now() }, // Ensure token is still valid
        });
    
        if (!user) {
          return res.status(400).json({ error: "Invalid or expired reset token" });
        }
    
        // Encrypt the new password
        const saltKey = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(newPassword, saltKey);
    
        // Update user's password and clear the reset token and expiry
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

//sign-in
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
                    token: generateToken(user.id),
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

//generate json webtoken
const generateToken = (userId) => {
    let token = jwt.sign({ payload: userId }, "youwillgavefun");
    return token;
};

//get user profile
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//update user profile
export const updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.id },
            req.body,
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

//delete user
export const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userId: req.params.id });

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//get list of all followers
export const getUserFollowers = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id }).populate(
            "followers",
            "username userId"
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ followers: user.followers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//get list of all following
export const getUserFollowing = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id }).populate(
            "following",
            "username userId"
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ following: user.following });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//follow user
export const followUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.payload); 
        const targetUser = await User.findById(req.params.id); 

        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!currentUser.following.includes(targetUser._id)) {
            currentUser.following.push(targetUser._id);
            await currentUser.save();
        }

        if (!targetUser.followers.includes(currentUser._id)) {
            targetUser.followers.push(currentUser._id);
            await targetUser.save();
        }

        return res.status(200).json({ message: "User followed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//unfollow user
export const unfollowUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.payload);
        const targetUser = await User.findById(req.params.id);
        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: "User not found" });
        }
        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== targetUser._id.toString()
        );
        await currentUser.save();
        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== currentUser._id.toString()
        );
        await targetUser.save();
        return res.status(200).json({ message: "User unfollowed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
