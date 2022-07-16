const express = require('express')
const RouteController = require('../controllers/RouteController')
const router = express.Router()

router.get("/",RouteController.getAllRoute)
router.post("/",RouteController.createRoutes)

module.exports = router