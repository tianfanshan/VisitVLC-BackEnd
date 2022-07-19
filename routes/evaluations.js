const express = require("express");
const router = express.Router();
const EvaluationController = require("../controllers/EvaluationController");
const { authentication, isOwner } = require("../middleware/authentication");

router.post("/", authentication, EvaluationController.createEvaluation)

module.exports = router;