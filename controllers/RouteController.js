require("dotenv").config();
const axios = require("axios");

const RouteController={
    async getAllroutes(req, res) {
        try {
            const result = await axios("https://api-routes-data.herokuapp.com/getRoutes/")
            const routes = result.data
            res.status(200).send({ message: "Routes found", routes })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with server" })
        }
    }
}

module.exports = RouteController;