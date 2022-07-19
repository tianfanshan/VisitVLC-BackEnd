const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema(
    {
        comment: String,
        userId: {
            type: ObjectId,
            ref: "User"
        },
        routeId: {
            type: String,
            required: true
        },
        placeId: {
            rtpe: String,
            required: true
        }
    }, { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;