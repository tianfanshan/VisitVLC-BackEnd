const express = require("express");
const RouteController = require("../controllers/RouteController");
const router = express.Router();
const {authentication} = require("../middleware/authentication");

router.get("/",authentication,RouteController.getAllroutes)

module.exports = router;