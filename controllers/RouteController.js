const Route = require('../models/Route')

const RouteController = {
    async getAllRoute(req,res){
        try {
            const routes = await Route.find()
            res.status(200).send(routes)
        } catch (error) {
            console.error(error)
            res.send(error)
        }
    },
    async createRoutes(req,res){
        try {
            const routes = await Route.create(...req.body)
            res.status(201).send(routes)
        } catch (error) {
            console.error(error)
            res.send(error)
        }
    }
}

module.exports = RouteController