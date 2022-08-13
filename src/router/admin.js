const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const AdminController = require("../app/controller/AdminController");
// all page
router.get("/page", AdminController.home);
// add new page
router.get("/add-page", AdminController.addPages);
// get edit page
router.get("/edit-page/:slug", AdminController.editPage);
//delete page

// create new page
router.post(
	"/add-page",
	body("title", "Title must have value").notEmpty(),
	body("content", "Content must have value").notEmpty(),
	AdminController.postaddPages,
);

// post edit page
router.put(
	"/edit-page/:slug",
	body("title", "Title must have value").notEmpty(),
	body("content", "Content must have value").notEmpty(),
	AdminController.posteditPages,
);
// update sorting page
router.post("/reorder-page", AdminController.reorderPage);
router.get("/delete-page/:slug", AdminController.detelePage);
module.exports = router;
