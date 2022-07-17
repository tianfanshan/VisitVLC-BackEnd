const Comment = require("../models/Comment");
const User = require("../models/User");

const CommentController = {
    async create(req, res) {
        try {
            const comment = await Comment.create({
                ...req.body,
                userId: req.user._id
            });
            await User.findByIdAndUpdate(
                req.user._id,
                { $push: { commentId: comment._id } },
                { new: true }
            );
            res.status(201).send({ message: "Comment created", comment })
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There has been a problem create comment" })
        }
    }
};

module.exports = CommentController;