const User = require("../models/User");
const Evaluation = require("../models/Evaluation")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const GET_ROUTE_BY_ID = process.env.GET_ROUTE_BY_ID;
const GET_PLACE_BY_ID = process.env.GET_PLACE_BY_ID;
const axios = require("axios");


const UserController = {
    async register(req, res, next) {
        try {
            if (req.body.password) {
                req.body.password = await bcrypt.hashSync(req.body.password, 10);
                const user = await User.create({
                    ...req.body,
                    role: "user",
                });
                res.status(201).send({ message: "Usuario registrado", user });
            } else {
                res.status(400).send({ message: "Por favor, introduzca su contraseña" });
            }
        } catch (error) {
            console.error(error);
            error.origin = "User";
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email })
            let favoriteRoutes = []
            if (user.favoriteRouteIds) {
                for (const id of user.favoriteRouteIds) {
                    const target = await axios.get(`${GET_ROUTE_BY_ID}${id}`)
                    favoriteRoutes = [...favoriteRoutes, target.data]
                }
            }
            let favoritePlaces = []
            if (user.favoritePlaceIds) {
                for (const id of user.favoritePlaceIds) {
                    const target = await axios.get(`${GET_PLACE_BY_ID}${id}`)
                    favoritePlaces = [...favoritePlaces, target.data]
                }
            }
            if (!user) {
                return res
                    .status(400)
                    .send({ message: "Correo de usuario o contraseña incorrecta" });
            }
            const isMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .send({ message: "Correo de usuario o contraseña incorrecta" });
            }
            token = jwt.sign({ _id: user._id }, JWT_SECRET);
            if (user.tokens.length > 4) user.tokens.shift();
            user.tokens.push(token);
            await user.save();
            return res.send({ message: "Bienvenid@ " + user.firstName, token, user, favoriteRoutes, favoritePlaces });
        } catch (error) {
            console.error(error);
            error.origin = "User";
            next(error);
        }
    },
    async logout(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.user._id, {
                $pull: { tokens: req.headers.authorization },
            });
            res.status(200).send({ message: "Usuario cerró la sesión con éxito", user });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "Hubo un problema con el servidor al cerrar sesión" });
        }
    },
    async update(req, res, next) {
        try {
            if (!req.body.password) {
                res.status(400).send({ message: "Por favor, introduzca su contraseña" })
            }
            const { firstName, lastName, gender, disabled } = req.body;
            const hashpassword = bcrypt.hashSync(req.body.password, 10);
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { firstName, password: hashpassword, lastName, gender, disabled },
                { new: true, runValidators: true, }
            );
            res.status(200).send({ message: "Información de usuario actualizada con éxito", user });
        } catch (error) {
            console.error(error);
            error.origin = "User";
            next(error);
        }
    },
    async findUserById(req, res) {
        try {
            if (req.params._id.length !== 24) {
                res.status(400).send({ message: "Este usuario no existe" })
            } else {
                const user = await User.findById(req.params._id);
                if (user == null) {
                    res.status(404).send({ message: "Este usuario no existe" });
                } else {
                    let favoriteRoutes = []
                    if (user.favoriteRouteIds) {
                        for (const id of user.favoriteRouteIds) {
                            const target = await axios.get(`${GET_ROUTE_BY_ID}${id}`)
                            favoriteRoutes = [...favoriteRoutes, target.data]
                        }
                    }
                    let favoritePlaces = []
                    if (user.favoritePlaceIds) {
                        for (const id of user.favoritePlaceIds) {
                            const target = await axios.get(`${GET_PLACE_BY_ID}${id}`)
                            favoritePlaces = [...favoritePlaces, target.data]
                        }
                    }
                    res.status(200).send({ message: "Usuario encontrado", user, favoriteRoutes, favoritePlaces });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
    async findAllUser(req, res) {
        try {
            const limit = 2
            const { page = 0 } = req.query;
            const users = await User.find()
                .limit(limit)
                .skip(page * limit)
                console.log(users)
            res.status(200).send({ message: "Todos los usuarios encontrado", users });
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
    async deleteUserById(req, res) {
        try {
            if (req.params._id.length !== 24) {
                res.status(400).send({ message: "Este usuario no existe" })
            } else {
                const user = await User.findByIdAndDelete(req.params._id);
                if (user == null) {
                    res.status(404).send({ message: "Este usuario no existe" });
                } else {
                    await Evaluation.deleteMany({ userId: req.params._id })
                    res.status(200).send({ message: "Usuario eliminado con éxito", user });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
    async fullUserInformation(req, res) {
        try {
            const { age, gender, accompaniment, duration, price, difficulty, transportation, typeOfRoute } = req.body
            if (age || gender || accompaniment || duration || price || difficulty || transportation || typeOfRoute) {
                const user = await User.findByIdAndUpdate(req.user._id, { age, gender, accompaniment, duration, price, difficulty, transportation, typeOfRoute, AIAvailable: true }, { new: true })
                res.status(200).send({ message: "La información del usuario completada", user })
            } else {
                res.status(400).send({ message: "Por favor, completa tu información" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Hubo un problema con el servidor al completar la información del usuario" })
        }
    }
};

module.exports = UserController;