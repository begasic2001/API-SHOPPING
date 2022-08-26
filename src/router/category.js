const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const CategoryController = require("../app/controller/CategoryController");
//category

router.get("/add-categories", CategoryController.getcategory);
router.post(
	"/add-categories",
	body("title", "Title must have value").notEmpty(),
	CategoryController.postaddCategory,
);

router.get("/edit-categories/:id", CategoryController.editcategory);
router.put(
	"/edit-categories/:id",
	body("title", "Title must have value").notEmpty(),
	CategoryController.postEditCategory,
);
router.get("/delete-categories/:id", CategoryController.deletecategory);
router.get("/", CategoryController.category);
module.exports = router