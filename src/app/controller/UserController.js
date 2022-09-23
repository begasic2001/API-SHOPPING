const Page = require("../model/page");
const Product = require("../model/product");
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const User = require("../model/user");
let bcrypt = require("bcrypt");
let passport = require("passport");
class UserController {
	home(req, res, next) {
		Page.findOne({ slug: "home" })
			.then((pages) => {
				res.render("user/index", {
					title: pages.title,
					content: pages.content,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	showPage(req, res, next) {
		let slug = req.params.slug;
		Page.findOne({ slug })
			.then((pages) => {
				if (!pages) {
					res.redirect("/user");
				}
				res.render("user/index", {
					title: pages.title,
					content: pages.content,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	getAllProduct(req, res, next) {
		Product.find({})
			.then((products) => {
				res.render("user/all_product", {
					products,
					title: "ALL PRODUCT",
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	getProductByCategory(req, res, next) {
		const category = req.params.category;
		Product.find({ category })
			.then((products) => {
				res.render("user/cat_product", {
					products,
					title: "ALL PRODUCT",
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	getProductDetail(req, res, next) {
		let galleryImages = null;
		let loggedIn = req.isAuthenticated() ? true : false;
		Product.findOne({ slug: req.params.product })
			.then((product) => {
				let galleryDir = `src/public/product_images/${product._id}/gallery`;
				fs.readdir(galleryDir, function (err, files) {
					galleryImages = files;
					res.render("user/product", {
						galleryImages,
						p: product,
						title: product.title,
						loggedIn,
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	/*
	 * GET register
	 */
	getRegister(req, res) {
		res.render("user/register", {
			title: "Register",
		});
	}

	/*
	 * POST register
	 */
	postRegister(req, res) {
		let name = req.body.name;
		let email = req.body.email;
		let username = req.body.username;
		let password = req.body.password;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("user/register", {
				alert,
				user: null,
				title: "Register",
			});
		} else {
			User.findOne({ username }, function (err, user) {
				if (err) console.log(err);

				if (user) {
					res.redirect("/user/register");
				} else {
					let user = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						admin: 0,
					});
					bcrypt.genSalt(10, function (err, salt) {
						bcrypt.hash(user.password, salt, function (err, hash) {
							if (err) console.log(err);

							user.password = hash;

							user.save(function (err) {
								if (err) {
									console.log(err);
								} else {
									res.redirect("/user");
								}
							});
						});
					});
				}
			});
		}
	}

	/*
	 * GET login
	 */
	getLogin(req, res) {
		if (res.locals.user) res.redirect("/");

		res.render("user/login", {
			title: "Log in",
		});
	}

	/*
	 * POST login
	 */
	postLogin(req, res, next) {
		passport.authenticate("local", {
			successRedirect: "/user",
			failureRedirect: "/user/login",
		})(req, res, next);
	}

	/*
	 * GET logout
	 */
	logout(req, res) {
		 req.logout(function (err) {
				if (err) {
					return next(err);
				}
				res.redirect("/user");
			});
	}
}

module.exports = new UserController();
