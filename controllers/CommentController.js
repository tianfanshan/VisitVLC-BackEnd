const Comment = require("../models/Comment");
const User = require("../models/User");

const CommentController = {
    async createComment(req, res) {
        try {
            const comment = await Comment.create({
                ...req.body,
                userId: req.user._id
            });
            await User.findByIdAndUpdate(
                req.user._id,
                { $push: { commentIds: comment._id } },
                { new: true }
            );
            res.status(201).send({ message: "Comment created", comment })
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There has been a problem create comment" })
        }
    },
    async deleteComment(req, res) {
        try {
            const comment = await Comment.findByIdAndDelete(req.params._id)
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { commentIds: req.params._id }
            });
            res.status(200).send({ message: "Comment delete successfull", comment })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with server" })
        }
    }
};

module.exports = CommentController;