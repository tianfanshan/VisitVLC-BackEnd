const express = require("express");
const router = express.Router();
const EvaluationController = require("../controllers/EvaluationController");
const { authentication, isAdmin, isYourEvaluationOrAdmin } = require("../middleware/authentication");

router.post("/RouteId/:id", authentication, EvaluationController.createEvaluationOfRoute);
router.put("/evaluationId/:_id", authentication, isYourEvaluationOrAdmin, EvaluationController.updateEvaluation);
router.delete("/id/:_id", authentication, isYourEvaluationOrAdmin, EvaluationController.deleteEvaluation);
router.get("/", authentication, isAdmin, EvaluationController.getAllEvaluation);
router.get("/id/:_id", authentication, isAdmin, EvaluationController.getEvaluationById);

module.exports = router;