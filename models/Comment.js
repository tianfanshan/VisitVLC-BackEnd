const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema(
    {
        comment: String,
        userId: { type: ObjectId, ref: "User" },
        evaluation: {
            type:Number,
            required:true
        }
        // routeId:{type:ObjectId,ref:""}
        // placeId:{type:ObjectId,ref:""}
    }, { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;