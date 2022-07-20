const express = require("express");
const router = express.Router();
const EvaluationController = require("../controllers/EvaluationController");
const { authentication, isOwner, isYourEvaluation } = require("../middleware/authentication");

router.post("/", authentication, EvaluationController.createEvaluation)
router.put("/evaluationId/:_id", authentication, isYourEvaluation, EvaluationController.updateEvaluation)

module.exports = router;