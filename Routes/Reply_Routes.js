// routes/postRoutes.js
const express = require("express");
const User = require("../Models/UserModels");
const Post = require("../Models/PostModel");
const Comment = require('../Models/CommentModel');
const Reply = require('../Models/ReplyModel');
const router = express.Router();
const auth = require("../Middleware/authmidlleware");

// Add a reply to a comment
router.post('/add-reply/:postId/:commentId', auth, async (req, res) => {
    const { replyBody } = req.body;
    const { postId, commentId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newReply = new Reply({
            postId,
            commentId,
            replyBody,
            repliedBy: {
                userId: user._id,
                username: user.username,
                profilePicUri: user.profilePicUri,
                name: user.name,
            },
        });

        await newReply.save();
        res.status(201).json({ message: "Reply added successfully", reply: newReply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Show all replies on a specific comment
router.get('/show-all-replies-on-comment/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const replies = await Reply.find({ commentId }).populate('repliedBy.userId', 'username profilePicUri name');
        res.status(200).json(replies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
