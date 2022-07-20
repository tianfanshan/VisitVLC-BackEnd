const express = require("express");
const router = express.Router();
const EvaluationController = require("../controllers/EvaluationController");
const { authentication, isOwner, isYourEvaluation, isAdmin, isYourEvaluationOrAdmin } = require("../middleware/authentication");

router.post("/", authentication, EvaluationController.createEvaluation);
router.put("/evaluationId/:_id", authentication, isYourEvaluationOrAdmin, EvaluationController.updateEvaluation);
router.delete("/id/:_id", authentication, isYourEvaluationOrAdmin, EvaluationController.deleteEvaluation)

module.exports = router;