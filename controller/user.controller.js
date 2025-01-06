import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { myOPT } from "../mailer/mymail.js"; 

export const SignUp = async (request, response, next) => {
    try {
        // Validate request body using express-validator
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            console.error("Validation errors:", errors.array());
            return response.status(400).json({ error: "Bad request", details: errors.array() });
        }

        const { email, password, username, contact } = request.body;

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

        user.verified = true; // Mark user as verified
        user.otp = null; // Clear OTP after verification
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

        // Generate a reset token and set its expiry time (optional)
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send reset link to user's email
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        await transporter.sendMail({
            from: "your-email@gmail.com",
            to: email,
            subject: "Password Reset",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>`,
        });

        res.status(200).json({ message: "Password reset link sent successfully" });
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