const express = require("express");
const PlaceController = require("../controllers/PlaceController");
const router = express.Router();
const { authentication } = require("../middleware/authentication");

router.get("/", authentication, PlaceController.getAllroutes)

module.exports = router;