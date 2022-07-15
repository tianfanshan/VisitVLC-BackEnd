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
        role: "user",
      });
      res.status(201).send({ message: "User created", user });
    } catch (error) {
      console.error(error);
      error.origin = "User";
      next(error);
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send("Incorrect username or password");
      }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send("Incorrect username or password");
      }
      token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      return res.send({ message: "Welcome " + user.name, token, user });
    } catch (error) {
      res
        .status(500)
        .send({ message: "There has been a problem on the server" });
    }
  },
};

module.exports = UserController;
