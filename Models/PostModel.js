const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  postContent: { type: String, required: true },
  postTags: [{ type: String }],
  postPhotoUri: { type: String },
  createdAt: { type: Date, default: Date.now },
  isGroupPost: { type: Boolean, default: false },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // optional, only for group posts
  user: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    profilePicUri: { type: String },
  },
});

module.exports = mongoose.model('Post', PostSchema);
