import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        auto: true     
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    dob: { 
        type: Date, 
        required: true 
    },
    bio: {
        type: String
    },
    profile_picture: {
        type: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    gender: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required:true
    },
    age: {
        type: Number,
    },
    personality_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PersonalityType'
    },
    badges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    }],
    privacy_settings: {
        profile_visibility: {
            type: String,
            enum: ['public', 'private', 'followers-only']
        },
        post_visibility: {
            type: String,
            enum: ['public', 'private', 'followers-only']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

export const User = mongoose.model('User', userSchema);