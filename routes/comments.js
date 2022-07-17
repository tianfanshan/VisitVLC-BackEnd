const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authentication } = require("../middleware/authentication");

router.post("/create", authentication, CommentController.create);

module.exports;