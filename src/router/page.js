const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const PageController = require("../app/controller/PageController");
// all page

// add new page
router.get("/add-page", PageController.addPages);
// get edit page
router.get("/edit-page/:slug", PageController.editPage);
//delete page

// create new page
router.post(
	"/add-page",
	body("title", "Title must have value").notEmpty(),
	body("content", "Content must have value").notEmpty(),
	PageController.postaddPages,
);

// post edit page
router.put(
	"/edit-page/:slug",
	body("title", "Title must have value").notEmpty(),
	body("content", "Content must have value").notEmpty(),
	PageController.posteditPages,
);
// update sorting page
router.post("/reorder-page", PageController.reorderPage);
router.get("/delete-page/:slug", PageController.detelePage);
router.get("/", PageController.home);
module.exports = router;