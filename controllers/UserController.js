const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.jwt_secret;

const UserController = {
    async register(req, res, next) {
        try {
            if (req.body.password) {
                req.body.password = await bcrypt.hashSync(req.body.password, 10);
                const user = await User.create({
                    ...req.body,
                    role: "user",
                });
                res.status(201).send({ message: "User created", user });
            } else {
                res.status(400).send({ message: "Please enter your password" });
            }
        } catch (error) {
            console.error(error);
            error.origin = "User";
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res
                    .status(400)
                    .send({ message: "Incorrect username or password" });
            }
            const isMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .send({ message: "Incorrect username or password" });
            }
            token = jwt.sign({ _id: user._id }, jwt_secret);
            if (user.tokens.length > 4) user.tokens.shift();
            user.tokens.push(token);
            await user.save();
            return res.send({ message: "Welcome " + user.firstName, token, user });
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
            res.status(200).send({ message: "User logged out successfully", user });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "there has been a problem disconnecting the user" });
        }
    },
    async update(req, res, next) {
        try {
            if (!req.body.password) {
                res.status(400).send({ message: "Please enter you password" })
            }
            const { firstName, lastName, gender, disabled } = req.body;
            const hashpassword = bcrypt.hashSync(req.body.password, 10);
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { firstName, password: hashpassword, lastName, gender, disabled },
                { new: true, runValidators: true, }
            );
            res.status(200).send({ message: "User update successfully", user });
        } catch (error) {
            console.error(error);
            error.origin = "User";
            next(error);
        }
    },
    async findUserById(req, res) {
        try {
            if(req.params._id.length !== 24){
                res.status(400).send({message:"This user dose not exist"})
            }else{
                const user = await User.findById(req.params._id);
                if (user == null) {
                    res.status(404).send({ message: "This user does not exist" });
                } else {
                    res.status(200).send({ message: "User found successfully", user });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
    async findAllUser(req, res) {
        try {
            const users = await User.find();
            res.status(200).send({ message: "All users found", users });
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
    async deleteUserById(req, res) {
        try {
            if(req.params._id.length !== 24){
                res.status(400).send({message:"This user dose not exist"})
            }else{
                const user = await User.findByIdAndDelete(req.params._id);
                if (user == null) {
                    res.status(404).send({ message: "This user does not exist" });
                }else{
                    res.status(200).send({ message: "User delete successfyly", user });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    },
};

module.exports = UserController;