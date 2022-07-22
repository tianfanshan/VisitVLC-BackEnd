require("dotenv").config();
const axios = require("axios");
const Evaluation = require("../models/Evaluation");
const get_all_routes = process.env.get_all_routes;
const get_route_by_id = process.env.get_route_by_id;

const RouteController = {
    async getAllroutes(req, res) {
        try {
            const result = await axios(get_all_routes)
            const routes = result.data
            const evaluations = await Evaluation.find()
            const evaluationRouteId = evaluations.map((route) => { return route.routeId })
            const routeId = [...new Set(evaluationRouteId)]
            let routesHasEvaluation = []
            for (const id of routeId) {
                const route = await axios.get(get_route_by_id + id)
                const evaluation = await Evaluation.find({routeId:id})
                let evaluationArray = [...evaluation]
                let obj = Object.assign({},route.data,evaluationArray)
                routesHasEvaluation.push(obj)
            }
            console.log(routesHasEvaluation)
            const routeWithEvaluation = routes.map(obj => routesHasEvaluation.find(o=>o.route_id === obj.route_id)||obj)
            res.status(200).send({ message: "Routes found", routeWithEvaluation })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with server" })
        }
    },
    async getRouteById(req, res) {
        try {
            const result = await axios.get(get_route_by_id + req.params.id)
            const route = result.data
            const evaluations = await Evaluation.find({ routeId: req.params.id })
            const scores = evaluations.map(evaluation => { return evaluation.score })
            const averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
            res.status(200).send({ message: "Route found", route, evaluations, averageScore })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with server" })
        }
    },
    async morePopular(req, res) {
        try {
            const evaluations = await Evaluation.find();
            let resFinal = [];
            evaluations.forEach(evaluation => {
                if (resFinal.some(item => item.routeId === evaluation.routeId)) {
                    const index = resFinal.findIndex(target => target.routeId === evaluation.routeId)
                    resFinal[index].allRating.push(evaluation.score)
                } else {
                    resFinal.push({ routeId: evaluation.routeId, allRating: [evaluation.score] })
                }
            })
            for (let [i, route] of resFinal.entries()) {
                const routeInfo = await axios.get(`${get_route_by_id}${route.routeId}`)
                resFinal[i].average = 0
                resFinal[i].allRating.forEach(element => resFinal[i].average += element)
                resFinal[i].average = (resFinal[i].average / resFinal[i].allRating.length).toFixed(1)
                resFinal[i] = { ...route, ...routeInfo.data }
            }
            resFinal.sort((b, a) => a.average - b.average)
            res.status(200).send(resFinal)
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = RouteController;