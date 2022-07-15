const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.jwt_secret;

const UserController = {
  async register(req, res, next) {
    try {
      const password = bcrypt.hashSync(req.body.password);
      const user = await User.create({
        ...req.body,
        password: password,
        role: 'user',
      });
      res.status(201).send({ message: "User created", user });
    } catch (error) {
      console.error(error);
      error.origin = "User";
      next(error);
    }
  },
};

module.exports = UserController;
