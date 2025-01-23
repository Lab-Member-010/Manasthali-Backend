import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: { type: String, required: true, unique: true },
    description: String,
    icon: String,
    personality_type: String,
    group_count: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model('Community', communitySchema);