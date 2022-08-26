const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const path = require("path");
const ProductController = require("../app/controller/ProductController");

router.get("/add-product", ProductController.addProduct);
router.post(
	"/add-product",
	body("title", "Title must have value").notEmpty(),
	body("desc", "Description must have value").notEmpty(),
	body("price", "Price must have value").isDecimal(),
	body("image")
		.custom((value, { req }) => {
			let imageFile =
				typeof req.files.image !== "undefined" ? req.files.image.name : "";
			var extension = path.extname(imageFile).toLowerCase();
			switch (extension) {
				case ".png":
					return ".png";
				case ".jpg":
					return ".jpg";
				case ".jpeg":
					return ".jpeg";
				case "":
					return ".jpg";
				default:
					return false;
			}
		})
		.withMessage("You must upload image !!"),
	ProductController.postAddProduct,
);
router.get("/edit-product/:id", ProductController.editProduct);
router.put(
	"/edit-product/:id",
	body("title", "Title must have value").notEmpty(),
	body("desc", "Description must have value").notEmpty(),
	body("price", "Price must have value").isDecimal(),
	body("image")
		.custom((value, { req }) => {
			let imageFile =
				typeof req.files.image !== "undefined" ? req.files.image.name : "";
			var extension = path.extname(imageFile).toLowerCase();
			switch (extension) {
				case ".png":
					return ".png";
				case ".jpg":
					return ".jpg";
				case ".jpeg":
					return ".jpeg";
				case "":
					return ".jpg";
				default:
					return false;
			}
		})
		.withMessage("You must upload image !!"),
	ProductController.postEditProduct,
);
router.post("/product-gallery/:id", ProductController.postGalleryImage);
router.get("/delete-image/:image",ProductController.postDeleteImage);
router.get("/delete-product/:id",ProductController.postDeleteProduct);
router.get("/", ProductController.product);
module.exports = router;
