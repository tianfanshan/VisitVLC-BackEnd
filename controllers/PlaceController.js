require("dotenv").config();
const axios = require("axios");
const GET_ALL_PLACES = process.env.GET_ALL_PLACES;
const GET_PLACE_BY_ID = process.env.GET_PLACE_BY_ID;

const RouteController = {
    async getAllroutes(req, res) {
        try {
            const result = await axios(GET_ALL_PLACES)
            const places = result.data
            res.status(200).send({ message: "Places found", places })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "There has been a problem with server" })
        }
    },
    async getPlaceById(req,res){
        try {
            const result = await axios.get(GET_PLACE_BY_ID + req.params.id)
            const place = result.data
            res.status(200).send({message:"Place found",place})
        } catch (error) {
            console.error(error)
            res.status(500).send({message:"There has been a problem with server"})
        }
    }
}

module.exports = RouteController;