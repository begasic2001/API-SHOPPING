const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const AdminController = require("../app/controller/AdminController");
// all page
router.get("/page", AdminController.home);
// add new page 
router.get("/add-page", AdminController.addPages);
// edit page
router.get("/edit-page/:slug", AdminController.editPage);
//delete page

// create new page
router.post(
	"/add-page",
	body("title", "Title must have value").notEmpty(),
	body("content", "Content must have value").notEmpty(),
	AdminController.postaddPages,
);

// update sorting page
router.post("/reorder-page", AdminController.reorderPage);

module.exports = router;
