const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authentication,
  isAdmin,
  isUserOrAdmin,
} = require("../middleware/authentication");


router.post("/", UserController.register);
router.post("/login", UserController.login);
router.delete("/logout", authentication, UserController.logout);
router.put("/update", authentication, UserController.update);
router.get("/user_Id/:_id", UserController.findUserById);
router.get("/users", authentication, isAdmin, UserController.findAllUser);
router.delete(
  "/user_Id/:_id",
  authentication,
  isUserOrAdmin,
  UserController.deleteUserById
);

module.exports = router;
