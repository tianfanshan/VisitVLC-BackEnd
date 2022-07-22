require("dotenv").config();
const axios = require("axios");
const get_all_places = process.env.get_all_places;

const RouteController={
    async getAllroutes(req, res) {
        try {
            const result = await axios(get_all_places)
            const places = result.data
            res.status(200).send({ message: "Places found", places })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with server" })
        }
    }
}

module.exports = RouteController;