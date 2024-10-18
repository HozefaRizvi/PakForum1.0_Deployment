const mongoose = require("mongoose");
const ReplySchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
    replyBody: { type: String, required: true },
    repliedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        profilePicUri: { type: String, required: true },
        name: { type: String, required: true },
    },
}, { timestamps: true });

module.exports = mongoose.model("Reply", ReplySchema);
