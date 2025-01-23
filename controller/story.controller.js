import Story from '../model/story.model.js';

export const uploadStory = async (req, res) => {
  try {
    const { userId, caption } = req.body;

    // Check if a file was uploaded
    const media = req.file ? req.file.filename : null;

    // Create and save the story
    const story = new Story({ userId, media, caption });
    const newStory = await story.save();

    res.status(200).json(newStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("userId", "name email").exec();  
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 
export const getStoryByID = async (req, res) => {
  // Logic to fetch story details by ID
  try{
    const storyId=req.params.id;
    const story=await Story.findById(storyId);
    if(!storyId){
     res.status(401).json({message:"user not found"})
    }
    res.status(200).json(story);
   }catch(err){
     console.log(err);
     res.status(500).json({error:"internal server "})
     
   }
};

// Get all stories posted by a user
export const getUserStories = async (req, res) => {
  // Logic to fetch all stories posted by a user
};

// Delete a story
export const deleteStory = async (req, res) => {
  // Logic to delete a story
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);

    if (!deletedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const StoryLike = async (req, res, next) => {
  try {
    const StoryId = req.params.id;
    const userId = req.body.userId;  
    console.log("StoryId: ", StoryId);  
    const story = await Story.findById(StoryId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    console.log("Story: ", story);   
    if (!story.likes.includes(userId)) {
      story.likes.push(userId);
      await story.save();
      return res.status(200).json({ message: "Story liked successfully", story });
    } else {
      return res.status(400).json({ message: "You already liked this story" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const CommentStory=async(req,res,next)=>{
  try{
const StoryId=req.params.id;
const {userId,text}=req.body;
const story=await Story.findById(StoryId);
if(!story){
  res.status(401).json({message:"story not found"})
}
console.log("Story: ", story);
story.comments.push(userId,text);
await story.save();
res.status(200).json({message:"comment add succesfuly"})
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const viewStory=async(req,res,next)=>{
  try{
const StoryId=req.params.id;
const userId=req.params.id;
console.log("StoryId: ", StoryId); 
const story = await Story.findById(StoryId);
 

if(!story){
  res.status(400).json({message:"story not found"})
}
if(!story.views.includes(userId)){
  story.views.push(userId);
  await story.save();
}
res.status(200).json({ message: "View recorded successfully",
  totalViews: story.views.length,
  viewers: story.views
 });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
