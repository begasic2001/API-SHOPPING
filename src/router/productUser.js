const express = require("express");
const router = express.Router();
const UserController = require("../app/controller/UserController");
router.get("/", UserController.getAllProduct);
module.exports = router;
