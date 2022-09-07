const express = require("express");
const router = express.Router();
const UserController = require("../app/controller/UserController");
router.get("/", UserController.getAllProduct);
router.get("/:category", UserController.getProductByCategory);
router.get("/:category/:product", UserController.getProductDetail);
module.exports = router;
