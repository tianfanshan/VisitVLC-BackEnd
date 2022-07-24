require("dotenv").config();
const axios = require("axios");
const Evaluation = require("../models/Evaluation");
const User = require("../models/User");
const GET_ALL_ROUTES = process.env.GET_ALL_ROUTES;
const GET_ROUTE_BY_ID = process.env.GET_ROUTE_BY_ID;

const RouteController = {
    async getAllroutes(req, res) {
        try {
            const result = await axios(GET_ALL_ROUTES)
            const routes = result.data
            const evaluations = await Evaluation.find()
            const evaluationRouteId = evaluations.map(route => route.routeId)
            const routeId = [...new Set(evaluationRouteId)]
            let routesHasEvaluation = []
            for (const id of routeId) {
                const route = await axios.get(GET_ROUTE_BY_ID + id)
                const evaluation = await Evaluation.find({ routeId: id })
                const evaluationScore = evaluation.map((evaluation) => { return evaluation.score })
                const averageScore = (evaluationScore.reduce((a, b) => a + b, 0) / evaluationScore.length).toFixed(1)
                const obj = {...route.data, averageScore: averageScore, evaluations: evaluation }
                routesHasEvaluation.push(obj)
            }
            const routesWithEvaluation = routes.map(obj => routesHasEvaluation.find(o => o.route_id === obj.route_id) || obj)
            res.status(200).send({ message: "Todas las rutas encontrada", routesWithEvaluation })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al mostrar todas las rutas" })
        }
    },
    async getRouteById(req, res) {
        try {
            const result = await axios.get(GET_ROUTE_BY_ID + req.params.id)
            const route = result.data
            const evaluations = await Evaluation.find({ routeId: req.params.id })
            const scores = evaluations.map(evaluation => { return evaluation.score })
            const averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
            res.status(200).send({ message: "Ruta encontrada", route, evaluations, averageScore })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al mostrar la ruta" })
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
                const routeInfo = await axios.get(`${GET_ROUTE_BY_ID}${route.routeId}`)
                resFinal[i].average = 0
                resFinal[i].allRating.forEach(element => resFinal[i].average += element)
                resFinal[i].average = (resFinal[i].average / resFinal[i].allRating.length).toFixed(1)
                resFinal[i] = {...route }
            }
            resFinal.sort((b, a) => a.average - b.average)
            resFinal = resFinal.slice(0, 5)
            for (let [i, route] of resFinal.entries()) {
                const routeInfo = await axios.get(`${GET_ROUTE_BY_ID}${route.routeId}`)
                resFinal[i] = {...route, ...routeInfo.data }
            }
            res.status(200).send(resFinal)
        } catch (error) {
            res.send(error)
        }
    },
    async filterRoute(req, res) {
        try {
            const result = await axios.get(GET_ALL_ROUTES)
            const routes = result.data
            const searchName = new RegExp(req.body.name, "i");
            let resp = routes.filter(({ name }) => name.match(searchName))
            console.log(resp)
            const searchType = new RegExp(req.body.type, "i")
            resp = resp.filter(({ type }) => type.match(searchType))
            const searchDifficulty = new RegExp(req.body.difficulty, "i")
            resp = resp.filter(({ difficulty }) => difficulty.match(searchDifficulty))
            const searchTransport = new RegExp(req.body.transport, "i")
            resp = resp.filter(({ transport }) => transport.match(searchTransport))


            if (resp.length == 0) {
                res.status(404).send({ message: "No hay la ruta que estas buscando" })
            } else {
                res.status(200).send(resp)
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with the name" })
        }
    },
    async favoriteRoute(req, res) {
        try {
            if (req.user.favoriteRouteIds.includes(req.params.id)) {
                res.status(400).send({ message: "Esta ruta ya está en tus favoritos" })
            } else {
                const user = await User.findByIdAndUpdate(
                    req.user._id, { $push: { favoriteRouteIds: req.params.id } }, { new: true }
                )
                res.status(201).send({ message: "Ruta añadida a tus favoritos", user })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al agregar una ruta a favoritos" })
        }
    },
    async favoriteRouteOut(req, res) {
        try {
            if (req.user.favoriteRouteIds.includes(req.params.id)) {
                const user = await User.findByIdAndUpdate(
                    req.user._id, { $pull: { favoriteRouteIds: req.params.id } }, { new: true }
                )
                res.status(200).send({ message: "Esta ruta ya no está en tus favoritos", user })
            } else {
                res.status(404).send({ message: "Esta ruta no está en tus favoritos" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al eliminar la ruta de favoritos" })
        }
    }
}

module.exports = RouteController;