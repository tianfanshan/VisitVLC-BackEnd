require("dotenv").config();
const axios = require("axios");
const User = require("../models/User");
const GET_ALL_PLACES = process.env.GET_ALL_PLACES;
const GET_PLACE_BY_ID = process.env.GET_PLACE_BY_ID;

const RouteController = {
    async getAllPlaces(req, res) {
        try {
            const result = await axios(GET_ALL_PLACES)
            const places = result.data
            res.status(200).send({ message: "Todos los lugares encontrado", places })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al mostrar todos los lugares" })
        }
    },
    async getPlaceById(req, res) {
        try {
            const result = await axios.get(GET_PLACE_BY_ID + req.params.id)
            const place = result.data
            res.status(200).send({ message: "Lugar encontrado", place })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al mostrar el lugar" })
        }
    },
    async favoritePlace(req, res) {
        try {
            if (req.user.favoritePlaceIds.includes(req.params.id)) {
                res.status(400).send({ message: "Este lugar ya está en tus favoritos" })
            } else {
                const user = await User.findByIdAndUpdate(
                    req.user._id,
                    { $push: { favoritePlaceIds: req.params.id } },
                    { new: true }
                )
                res.status(201).send({ message: "Lugar agregado a tus favoritos", user })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al agregar un lugar a favoritos" })
        }
    },
    async favoritePlaceOut(req, res) {
        try {
            if (req.user.favoritePlaceIds.includes(req.params.id)) {
                const user = await User.findByIdAndUpdate(
                    req.user._id,
                    { $pull: { favoritePlaceIds: req.params.id } },
                    { new: true }
                )
                res.status(200).send({ message: "Este lugar ya no está en tus favoritos", user })
            } else {
                res.status(404).send({ message: "Este lugar no está en tus favoritos" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al eliminar un lugar de favoritos" })
        }
    }
}

module.exports = RouteController;