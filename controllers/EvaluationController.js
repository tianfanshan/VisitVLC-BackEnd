const Evaluation = require("../models/Evaluation");
const User = require("../models/User");
const axios = require("axios")

const EvaluationController = {
    async createEvaluation(req, res) {
        try {
            const result = await axios("https://pilgrimtests.000webhostapp.com/mockapi/getall/")
            const evaluation = await Evaluation.create({ ...req.body, userId: req.user._id })
            res.status(201).send([evaluation,result.data])
        } catch (error) {
            console.error(error)
            res.send({ message: "There has been a problem a creating evaluation" })
        }
    }
};

module.exports = EvaluationController;