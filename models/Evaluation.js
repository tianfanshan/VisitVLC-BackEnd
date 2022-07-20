const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        minlength: [20,"We need your suggestion, please write at least 20 characters"],
        required: [true, "This is very helpful to improve our tourism environment"]
    },
    score: {
        type: Number,
        required: [true, "Please rate the route, it's important to us"]
    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
    // routeId: {
    //     type: String,
    //     required: true
    // },
    // placeId: {
    //     type: String,
    //     required: true
    // }
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;