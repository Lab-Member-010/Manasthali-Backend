// user.controller.js
import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        if (!errors.isEmpty())
            return response.status(401).json({ error: "Bad request" });

        let saltKey = bcrypt.genSaltSync(10);
        let encryptedPassword = bcrypt.hashSync(request.body.password, saltKey);
        request.body.password = encryptedPassword;

        let user = await User.create(request.body);
        return response.status(201).json({ message: "Sign up success", user });
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