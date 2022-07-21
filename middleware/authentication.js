const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, jwt_secret);
    const user = await User.findOne({ _id: payload._id, tokens: token });
    if (!user) {
      return res.status(401).send({ message: "You are not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error, message: "There has been a problem with the token" });
  }
};

const isAdmin = async (req, res, next) => {
  const admins = ["admin"];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({
      message: "You do not have permission",
    });
  }
  next();
};

const isUserOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role == "admin" || req.user._id == req.params._id) {
      return next()
    } else {
      res.status(400).send({ message: "You do not have permission" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "There has been a problem with serve" })
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
    return res.status(403).send({ message: "Sorry you have not permission" })
  } catch (error) {
    return res.status(500).send({ message: "There has been a problem" })
  }
}




module.exports = { authentication, isAdmin, isUserOrAdmin, isYourEvaluationOrAdmin };
