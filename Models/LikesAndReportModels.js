const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  likes: { type: Number, default: 0 }
});

const PostReportSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  reports: { type: Number, default: 0 }
});

const PostLike = mongoose.model('PostLike', PostLikeSchema);
const PostReport = mongoose.model('PostReport', PostReportSchema);

module.exports = { PostLike, PostReport };
