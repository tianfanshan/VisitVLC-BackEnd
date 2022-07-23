const express = require("express");
const RouteController = require("../controllers/RouteController");
const router = express.Router();
const {authentication} = require("../middleware/authentication");

router.get("/",authentication,RouteController.getAllroutes);
router.get("/id/:id",authentication,RouteController.getRouteById);
router.get("/morePopular",RouteController.morePopular);
router.get("/name/:name",RouteController.getRouteByName);

module.exports = router;