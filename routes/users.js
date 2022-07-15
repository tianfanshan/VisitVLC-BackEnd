const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication } = require("../middleware/authentication");

router.post("/", UserController.register);
router.post("/login", UserController.login);
router.delete("/logout", authentication, UserController.logout);
router.put("/update",authentication,UserController.update)
router.get("/firstName",UserController.findUserByFirstName)
router.get("/user_Id/:_id",UserController.findUserById)
router.get("/users",authentication,UserController.findAllUser)
router.delete("/user_Id/:_id",authentication,UserController.deleteUserById)


module.exports = router;
