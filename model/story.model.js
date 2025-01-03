import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    auto: true,
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  media: [{type:String,required:true,}],
  caption: { type:String},
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  upload_date_time: { type: Date, default: Date.now },
  end_date_time: { type: Date },
}, {
    timestamps: true 
});

export default mongoose.model("Story", storySchema);
