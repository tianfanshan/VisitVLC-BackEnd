require("dotenv").config();
const axios = require("axios");
const get_all_routes = process.env.get_all_routes;

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
    }
}

module.exports = RouteController;