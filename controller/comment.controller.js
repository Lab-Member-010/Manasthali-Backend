import { request, response } from "express";
import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import { User } from "../model/user.model.js";

// Add a new comment to a post
export const addComment = async (request, response, next) => {
  // Logic to add a new comment
  try {
    const { post_id, user_id, comment, parent_comment_id } = request.body;

    const newComment = new Comment({
      post_id,
      user_id,
      comment,
      parent_comment_id: parent_comment_id || null,
    });

    await newComment.save();

    const post = await Post.findById(post_id);
    post.comment_count += 1;
    await post.save();

    response
      .status(201)
      .json({ message: "Comment added successfully", newComment });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Server error", error });
  }
};

// Get details of a specific comment
export const getCommentDetails = async (req, res) => {
  // Logic to fetch comment details by ID

  try {
    const { id } = req.params;
    const comment = await Comment.findOne({ _id: id }).populate("user_id");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "comment fetch successfully", comment });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Server error" });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  // Logic to update a comment
  try {
    const { id } = request.params;
    let updateData = request.body;

    const commentById = await Comment.findOne({ _id: id });
    if (!commentById) {
      return response.status(404).json({ error: "comment not found" });
    }

    const result = await Comment.updateOne({ _id: id }, { $set: updateData });
    return response
      .status(200)
      .json({ message: "comment updated successfully", result });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment

export const deleteComment = async (req, res) => {
  // Logic to delete a comment
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const post = await Post.findById(comment.post_id);
    post.comment_count -= 1;
    await post.save();

    await Comment.deleteOne({ _id: id });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  // Logic to like a comment

  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const comment = await Comment.findOne({ _id: id });
    const user = await User.findOne({ _id: user_id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!comment.comment_likes.includes(user_id)) {
      comment.comment_likes.push(user_id);
      await comment.save();
    } else {
      return res
        .status(400)
        .json({ message: "User already liked this comment" });
    }

    res.status(200).json({ message: "Comment liked successfully", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
