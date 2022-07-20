const Evaluation = require("../models/Evaluation");
const User = require("../models/User");
const axios = require("axios")

const EvaluationController = {
    async createEvaluation(req, res, next) {
        try {
            const result = await axios("https://pilgrimtests.000webhostapp.com/mockapi/getall/")
            const evaluation = await Evaluation.create(
                { ...req.body, userId: req.user._id, routeId: result.data[0].id }
            )
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { $push: { evaluationIds: evaluation._id } },
                { new: true }
            )
            res.status(201).send([evaluation, result.data[0], user])
        } catch (error) {
            console.error(error);
            error.origin = "Evaluation";
            next(error);
        }
    },
    async updateEvaluation(req, res, next) {
        try {
            const { score, comment } = req.body
            const evaluation = await Evaluation.findByIdAndUpdate(
                req.params._id,
                { score, comment },
                { new: true, runValidators: true }
            )
            res.status(200).send({ message: "Evaluation updated successfuly", evaluation })
        } catch (error) {
            console.error(error);
            error.origin = "Evaluation";
            next(error);
        }
    },
};

module.exports = EvaluationController;