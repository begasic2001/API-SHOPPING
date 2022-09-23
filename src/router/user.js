const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const UserController = require("../app/controller/UserController");

router.get("/login", UserController.getLogin);
router.post("/login", UserController.postLogin);
router.post(
	"/register",
	body("name", "Name is required!").notEmpty(),
	body("email", "Email is required!").isEmail(),
	body("username", "Username is required!").notEmpty(),
	body("password", "Password is required!").notEmpty(),
	UserController.postRegister,
);
router.get("/logout", UserController.logout);
router.get("/register", UserController.getRegister);
router.get("/:slug", UserController.showPage);
router.get("/", UserController.home);

module.exports = router;
