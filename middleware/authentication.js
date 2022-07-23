const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: payload._id, tokens: token });
    if (!user) {
      return res.status(401).send({ message: "Usted no está autorizado" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error, message: "Hay un problema con el token" });
  }
};

const isAdmin = async (req, res, next) => {
  const admins = ["admin"];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({
      message: "No tienes permiso",
    });
  }
  next();
};

const isUserOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role == "admin" || req.user._id == req.params._id) {
      return next()
    } else {
      res.status(400).send({ message: "No tienes permiso" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "Hubo un problema con el servidor" })
  }
}

const isYourEvaluationOrAdmin = async (req, res, next) => {
  try {
    const id = await req.user.evaluationIds.map((e) => {
      return e.toString()
    })
    if (id.includes(req.params._id) || req.user.role == "admin") {
      return next()
    }
    return res.status(403).send({ message: "No tienes permiso" })
  } catch (error) {
    return res.status(500).send({ message: "Hubo un problema con el servidor" })
  }
}




module.exports = { authentication, isAdmin, isUserOrAdmin, isYourEvaluationOrAdmin };
