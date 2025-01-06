import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  media: [{ type: String, required: true, }],
  caption: String,
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String },
    },
  ],
  upload_date_time: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model("Story", storySchema);
