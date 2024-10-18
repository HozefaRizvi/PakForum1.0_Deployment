const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, 
    commentBody: { type: String, required: true }, 
    commentedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
        profilePicUri: { type: String }, 
        name: { type: String, required: true }, 
    },
    createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('CommentSection', CommentSchema);
