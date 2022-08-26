const { body, validationResult } = require("express-validator");
const Category = require("../model/category");

class CategoryController {
	//category
	category(req, res, next) {
		Category.find({})
			.then((categories) => {
				res.render("admin/categories", {
					categories,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	// get page category
	getcategory(req, res, next) {
		const title = "";
		res.render("admin/add-categories", {
			title,
		});
	}
	// post add category
	postaddCategory(req, res, next) {
		let title = req.body.title;
		let slug = title.replace(/\s+/g, "-").toLowerCase();
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("admin/add-categories", {
				alert,
			});
		} else {
			Category.findOne({
				slug,
			})
				.then((categories) => {
					if (categories) {
						res.render("admin/add-categories", {
							title,
							slug,
						});
					} else {
						Category.create({
							title,
							slug,
						}).then(() => {
							res.redirect("http://localhost:9000/api/categories");
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	// get edit page category
	editcategory(req, res, next) {
		const id = req.params.id;
		Category.findOne({ _id: id })
			.then((categories) => {
				res.render("admin/edit-categories", {
					title: categories.title,
					id: categories._id,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	// put edit category
	postEditCategory(req, res, next) {
		// res.send("chuyen trang thanh cong")
		const id = req.params.id;
		let title = req.body.title;
		let slug = title.replace(/\s+/g, "-").toLowerCase();

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("admin/edit-categories", {
				alert,
			});
		} else {
			Category.findOne({
				slug,
				_id: { $ne: id },
			})
				.then((page) => {
					if (page) {
						res.render("admin/edit-categories", {
							title,
							slug,
							id,
						});
					} else {
						Category.findByIdAndUpdate(id, {
							title,
							slug,
						}).then((pages) => {
							// console.log(pages)
							res.redirect("/api/categories/edit-categories/" + pages._id);
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	// deltete category
	deletecategory(req, res, next) {
		Category.findByIdAndDelete({
			_id: req.params.id,
		})
			.then(() => {
				res.redirect("/api/categories/");
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
module.exports = new CategoryController();
