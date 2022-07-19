const Evaluation = require("../models/Evaluation");
const User = require("../models/User");

const EvaluationController = {
    async createEvaluation(req, res) {
        try {
            const evaluation = await Evaluation.create({ ...req.body, userId: req.user._id })
            res.send(evaluation)
        } catch (error) {
            console.error(error)
            res.send({ message: "There has been a problem a creating evaluation" })
        }
    }
};

module.exports = EvaluationController;