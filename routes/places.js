const express = require("express");
const PlaceController = require("../controllers/PlaceController");
const router = express.Router();
const { authentication } = require("../middleware/authentication");

router.get("/", authentication, PlaceController.getAllPlaces);
router.get("/id/:id", authentication, PlaceController.getPlaceById);
router.put("/addPlaceToFavorite/:id", authentication, PlaceController.favoritePlace);
router.put("/favoritePlaceOut/:id", authentication, PlaceController.favoritePlaceOut);

module.exports = router;