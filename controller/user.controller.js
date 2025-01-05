// user.controller.js

import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sharmajayesh085@gmail.com", // Use environment variables in production
    pass: "Turt11it",
  },
});

export const SignIn = async (request, response, next) => {
    try {
        let { email, password } = request.body;
        let user = await User.findOne({ email });
        if (user) {
            let status = bcrypt.compareSync(password, user.password);
            if(status){
                return response.status(200).json({message: "Sign in success..",user,token: generateToken(user.userId)});
            }else{
                return response.status(401).json({error: "Bad request | invalid password"});
            }
        } else{
            return response.status(401).json({error: "Bad request | invalid email id"});
        }
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};

export const SignUp = async (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            console.error("Validation errors:", errors.array()); // Log validation errors
            return response.status(400).json({ error: "Bad request", details: errors.array() });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: request.body.email });
        if (existingUser) {
            console.error(`Email already exists: ${request.body.email}`); // Log duplicate email issue
            return response.status(409).json({ error: "Email already exists" });
        }

        // Encrypt password
        const saltKey = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(request.body.password, saltKey);
        request.body.password = encryptedPassword;

        // Create user
        const user = new User(request.body);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        user.otp = otp; // Store OTP in the user document
        await user.save();

        // Send OTP email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER, // Use environment variables for secure credentials
                to: user.email,
                subject: "Verification Email",
                text: `Your OTP is ${otp}.`,
            });
            console.log(`OTP email sent successfully to: ${user.email}`); // Log successful email sending
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError); // Log email error details
            return response.status(500).json({ error: "Failed to send verification email" });
        }

        // Return success response
        return response.status(201).json({
            message: "Sign up success. OTP sent to your email.",
            user: { id: user.id, email: user.email, username: user.username }, // Send only safe data
        });
    } catch (err) {
        console.error("Unexpected error during SignUp process:", err); // Log unexpected errors
        return response.status(500).json({ error: "Internal Server Error" });
    }
};


const generateToken = (userId) => {
    let token = jwt.sign({ payload: userId }, "youwillgavefun");
    return token;
};

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

// Send Verification Email/OTP
export const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const user = await User.findOneAndUpdate({ email }, { otp }, { new: true });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await transporter.sendMail({
            from: "sharmajayesh085@gmail.com",
            to: email,
            subject: "Verification Email",
            text: `Your OTP is ${otp}.`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
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

        user.otp = null; // Clear OTP after verification
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const token = crypto.randomBytes(32).toString("hex");
        const user = await User.findOneAndUpdate({ email }, { resetToken: token }, { new: true });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const resetLink = `http://localhost:3000/reset-password/${token}`;

        await transporter.sendMail({
            from: "your-email@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `Reset your password using this link: ${resetLink}`,
        });

        res.status(200).json({
            message: "Password reset link sent successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ resetToken: token });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        let saltKey = bcrypt.genSaltSync(10);
        let encryptedPassword = bcrypt.hashSync(newPassword, saltKey);
        user.password = encryptedPassword;
        user.resetToken = null; // Clear reset token after password reset

        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
