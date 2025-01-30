import Post from '../model/post.model.js';
import Comment from '../model/comment.model.js'
import { User } from "../model/user.model.js"; 
//Create a new post
export const createPost = async (request, response, next) => {
  try {
    let { userId,description } = request.body;
    const media = request.files.map((file) => file.path);
    let newpost = new Post({ userId,description, media });
    let savepost = await newpost.save();
    return response.status(201).json({ message: "post created successfully", savepost });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Inatenal srver error" });
  }
}

// Get post details
export const getPostDetails = async (request, response, next) => {
  // Logic to fetch post details by ID
  try {
    let { id } = request.params;
    let postbyId = await Post.findOne({ _id: id });
    if (!postbyId) {
      return response.status(404).json({ error: "post not found" });
    }
    return response.status(201).json({ message: "post daetail successfully", postbyId });



  }
  catch (error) {
    return response.status(500).json({ error: "internal server error" });
  }
}


// Update a post
export const updatePost = async (request, response, next) => {
  // Logic to update a post
  try {
    const { id } = request.params;
    let updateData = request.body
    const PostById = await Post.findOne({ _id: id });
    if (!PostById) {
      return response.status(404).json({ error: "Post not found" });
    }

    const result = await Post.updateOne({ _id: id }, { $set: updateData });
    return response.status(200).json({ message: "Post updated successfully", result });
  } catch (error) {
    console.error("Error updating post:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
};

// Delete a post
export const deletePost = async (request, response, next) => {
  // Logic to delete a post
  try {
    const { id } = request.params;
    let postbyId = await Post.findOne({ _id: id });
    if (!postbyId) {
      return response.status(404).json({ error: "Post not found for delete" })
    }
    await Post.deleteOne({ _id: id });
    return response.status(201).json({ message: "Post deleted successfully" });

  }
  catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Intenal server error" })
  }
};

  // Like Post 
export const likePost = async (request, response) => {
  try {
    const { id } = request.params;
    const { userId } = request.body;
    const post = await Post.findById(id);

    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return response.status(400).json({ message: "Already liked" });
    }

    post.likes.push(userId);
    await post.save();
    return response.status(200).json({ message: "Post liked", likeCount: post.likes.length });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
};

 
export const unlikePost = async (request, response) => {
  try {
    const { id } = request.params;
    const { userId } = request.body;
    const post = await Post.findById(id);
    
    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      return response.status(400).json({ message: "You haven't liked this post" });
    }
    post.likes = post.likes.filter(likeId => !likeId.equals(userId));
    await post.save();

    return response.status(200).json({ message: "Post unliked", likeCount: post.likes.length });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('comments'); // Ensure the comments are populated

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post with comments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Share a post
export const sharePost = async (req, res) => {
  // Logic to share a post

  try {
    const { userId } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const sharedPost = new Post({
      userId,
      media: post.media,
      description: post.description,
      tags: post.tags,
      communityId: post.communityId,
      location: post.location,
      shared_post_id: postId,
      likes: [],
    });

    await sharedPost.save();

    post.shares += 1;
    await post.save();

    res.status(201).json({ message: 'Post shared successfully', sharedPost });
  } catch (error) {
    res.status(500).json({ message: ' internal Server error' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
      const excludedId = req.params.id; 
      const posts = await Post.find({ _id: { $ne: excludedId } })
        .populate('userId', 'username profile_picture')
        .populate('likes', 'username profile_picture')
        .populate({
          path: 'comments',
          populate: {
            path: 'userId',
            select: 'username profilePicture',
          }
        })
        .sort({ createdAt: -1 });

      if (!posts || posts.length === 0) {
          return res.status(404).json({
              message: "No posts found",
          });
      }

      return res.status(200).json({
          posts, 
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "Server error, could not retrieve posts",
      });
  }
};