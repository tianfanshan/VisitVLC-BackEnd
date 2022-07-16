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

const isOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "This is not your account" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "There has been a problem confirming the user" });
  }
};


module.exports = { authentication, isAdmin, isOwner };
