const express = require("express");
const router = express.Router();
const CartController = require("../app/controller/CartController");
router.get("/add/:product", CartController.addToCart);
router.get("/checkout", CartController.checkout);
router.get("/update/:product", CartController.updateProduct);
router.get("/clear", CartController.clear);
router.get("/buynow", CartController.buyNow);
module.exports = router;
