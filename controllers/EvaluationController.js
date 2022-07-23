const Evaluation = require("../models/Evaluation");
const User = require("../models/User");
const axios = require("axios");
const GET_ROUTE_BY_ID = process.env.GET_ROUTE_BY_ID


const EvaluationController = {
    async createEvaluationOfRoute(req, res, next) {
        try {
            if (!req.params.id) {
                res.status(400).send({ message: "Por favor seleccione una ruta" })
            } else {
                const evaluation = await Evaluation.create(
                    { ...req.body, userId: req.user._id, routeId: req.params.id }
                )
                const user = await User.findByIdAndUpdate(
                    req.user._id,
                    { $push: { evaluationIds: evaluation._id } },
                    { new: true }
                )
                const result = await axios.get(GET_ROUTE_BY_ID + req.params.id)
                const route = result.data
                res.status(201).send([evaluation, user, route])
            }
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
            res.status(200).send({ message: "Evaluación actualizada con éxito", evaluation })
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
            res.status(200).send({ message: "Evaluación eliminada con éxito", evaluation })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al eliminar la evaluación" })
        }
    },
    async getAllEvaluation(req, res) {
        try {
            const evaluations = await Evaluation.find()
            res.status(200).send({ message: "Todas las evaluaciónes encontrada", evaluations })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al mostrar todas las evaluaciónes" })
        }
    },
    async getEvaluationById(req, res) {
        try {
            const evaluation = await Evaluation.findById(req.params._id)
            res.status(200).send({ message: "Evaluación encontrada", evaluation })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema al mostrar la evaluación" })
        }
    }
};

module.exports = EvaluationController;