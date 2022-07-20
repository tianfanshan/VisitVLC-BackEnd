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
            const user = await User.find({evaluationIds:req.params._id});
            user.forEach(async user=>{
                await User.findByIdAndUpdate(user._id,
                    {$pull:{evaluationIds:req.params._id}}
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
    async getEvaluationById(req,res){
        try {
            const evaluation = await Evaluation.findById(req.params._id)
            res.status(200).send({message:"Evaluation find successfully",evaluation})
        } catch (error) {
            console.error(error)
            res.status(500).send({message:"There has been a problem of serve"})
        }
    }
};

module.exports = EvaluationController;