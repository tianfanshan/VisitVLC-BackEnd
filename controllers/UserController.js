const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.jwt_secret

const UserController = {
    async create(req,res){
        try {
            const password = bcrypt.hashSync(req.body.password)
            const user = await User.create({
                ...req.body,
                password:password,
                role:user
            })
            res.status(201).send({message:"User created",user})
        } catch (error) {
            cosole.error(error)
            res.send('error')
        }
    }

}

module.exports = UserController