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
            res.status(200).send({ message: "Routes found", routes })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with server" })
        }
    },
    async getRouteById(req, res) {
        try {
            const result = await axios.get(get_route_by_id + req.params.id)
            const route = result.data
            res.status(200).send({ message: "Route found", route })
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