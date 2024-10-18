const express = require("express");
const User = require("../Models/UserModels");
const Post = require("../Models/PostModel");
const Comment = require('../Models/CommentModel');
const router = express.Router();
const auth = require("../Middleware/authmidlleware");

// Add comment route
router.post('/add-comment/:postId', auth, async (req, res) => {
    const { commentBody } = req.body;
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newComment = new Comment({
            postId,
            commentBody,
            commentedBy: {
                userId: user._id,
                username: user.username,
                profilePicUri: user.profilePicUri,
                name: user.name,
            },
        });
        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to delete a specific comment
router.delete('/delete-specific-comment/:commentId', auth, async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the post is owned by the current user
        const post = await Post.findById(comment.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You do not have permission to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to show all comments of a specific post
router.get('/show-all-comments-of-post/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const comments = await Comment.find({ postId }).populate('commentedBy.userId', 'username profilePicUri name');
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
