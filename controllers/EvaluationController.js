const Evaluation = require("../models/Evaluation");
const User = require("../models/User");
const axios = require("axios");
const get_route_by_id = process.env.get_route_by_id


const EvaluationController = {
    async createEvaluationOfRoute(req, res, next) {
        try {
            if (!req.params.id) {
                res.status(400).send({ message: "Pleace select the route" })
            } else {
                const evaluation = await Evaluation.create(
                    { ...req.body, userId: req.user._id, routeId: req.params.id }
                )
                const user = await User.findByIdAndUpdate(
                    req.user._id,
                    { $push: { evaluationIds: evaluation._id } },
                    { new: true }
                )
                const result = await axios.get(get_route_by_id + req.params.id)
                const route = result.data
                res.status(201).send([evaluation, user, route])
            }
        } catch (error) {
            console.error(error);
            error.origin = "Evaluation";
            next(error);
        }
    },
    // async createEvaluationOfPlace(req,res){
    //     try {
    //         const evaluation = await Evaluation.create(
    //             {...req.body,userId:req.user._id,}
    //         )
    //     } catch (error) {

    //     }
    // },
    async updateEvaluation(req, res, next) {
        try {
            const { score, comment } = req.body
            const evaluation = await Evaluation.findByIdAndUpdate(
                req.params._id,
                { score, comment },
                { new: true, runValidators: true }
            )
            res.status(200).send({ message: "Evaluation updated successfully", evaluation })
        } catch (error) {
            console.error(error);
            error.origin = "Evaluation";
            next(error);
        }
    },
    async deleteEvaluation(req, res) {
        try {
            const evaluation = await Evaluation.findByIdAndDelete(req.params._id)
            const user = await User.find({ evaluationIds: req.params._id });
            user.forEach(async user => {
                await User.findByIdAndUpdate(user._id,
                    { $pull: { evaluationIds: req.params._id } }
                )
            })
            res.status(200).send({ message: "Evaluation delete successfully", evaluation })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem deleting a evaluation" })
        }
    },
    async getAllEvaluation(req, res) {
        try {
            const evaluations = await Evaluation.find()
            res.status(200).send({ message: "All evaluation finded", evaluations })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem to get all evaluations" })
        }
    },
    async getEvaluationById(req, res) {
        try {
            const evaluation = await Evaluation.findById(req.params._id)
            res.status(200).send({ message: "Evaluation find successfully", evaluation })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem of serve" })
        }
    }
};

module.exports = EvaluationController;