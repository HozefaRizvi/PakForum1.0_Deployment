const express = require('express');
const User = require('../Models/UserModels');
const Post = require('../Models/PostModel');
const { PostLike, PostReport } = require('../Models/LikesAndReportModels');
const Reply = require('../Models/ReplyModel');
const Comment = require('../Models/CommentModel');
const router = express.Router();
const auth = require('../Middleware/authmidlleware');
router.post('/add-post', auth, async (req, res) => {
  const { postContent, postTags, postPhotoUri, isGroupPost, groupId } = req.body;
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newPost = new Post({
      postContent,
      postTags,
      postPhotoUri,
      isGroupPost,
      groupId: isGroupPost ? groupId : null,
      user: {
        userId: user._id,
        username: user.name,
        profilePicUri: user.profilePicUri
      }
    });
    
    await newPost.save();
    res.status(201).json({ message: 'Post added successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to show all posts
router.get('/show-posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to edit a post
router.put('/edit-post/:postId', auth, async (req, res) => {
  const { postContent, postTags, postPhotoUri } = req.body;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    if (postContent) post.postContent = postContent;
    if (postTags) post.postTags = postTags;
    if (postPhotoUri) post.postPhotoUri = postPhotoUri;

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to delete a post (and its associated comments and replies)
router.delete('/delete-post/:postId', auth, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);

    // Delete associated comments and replies
    const comments = await Comment.find({ postId });
    for (const comment of comments) {
      await Reply.deleteMany({ commentId: comment._id });
    }
    await Comment.deleteMany({ postId });

    // Also delete associated likes and reports
    await PostLike.deleteMany({ postId });
    await PostReport.deleteMany({ postId });

    res.status(200).json({ message: 'Post and associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to like a post
router.post('/like-post/:postId', auth, async (req, res) => {
  const postId = req.params.postId;

  try {
    let postLike = await PostLike.findOne({ postId });
    if (!postLike) {
      postLike = new PostLike({ postId });
    }

    postLike.likes += 1;
    await postLike.save();
    
    res.status(200).json({ message: 'Post liked successfully', postLike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to report a post
router.post('/report-post/:postId', auth, async (req, res) => {
  const postId = req.params.postId;

  try {
    let postReport = await PostReport.findOne({ postId });
    if (!postReport) {
      postReport = new PostReport({ postId });
    }

    postReport.reports += 1;
    await postReport.save();

    res.status(200).json({ message: 'Post reported successfully', postReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/show-specificpost/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get("/showgroup-post/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
      const posts = await Post.find({ groupId }) 
          .populate('user.userId', 'username profilePicUri'); 
      
      if (posts.length === 0) {
          return res.status(404).json({ message: "No posts found for this group" });
      }
      
      res.status(200).json(posts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
});

// Route to show user posts
router.get('/showuserposts/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {

    const posts = await Post.find({ 'user.userId': userId })
      .populate('user.userId', 'username profilePicUri');

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
