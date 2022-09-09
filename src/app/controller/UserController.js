const Page = require("../model/page");
const Product = require("../model/product");
var mkdirp = require("mkdirp");
var resizeImg = require("resize-img");
const fs = require("fs-extra");
let User = require("../model/user");
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
		Product.findOne({ slug: req.params.product })
			.then((product) => {
				let galleryDir = `src/public/product_images/${product._id}/gallery`;
				fs.readdir(galleryDir, function (err, files) {
					galleryImages = files;
					res.render("user/product", {
						galleryImages,
						p: product,
						title: product.title,
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
		res.render("register", {
			title: "Register",
		});
	}

	/*
	 * POST register
	 */
	postRegister(req, res) {
		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		var password2 = req.body.password2;

		req.checkBody("name", "Name is required!").notEmpty();
		req.checkBody("email", "Email is required!").isEmail();
		req.checkBody("username", "Username is required!").notEmpty();
		req.checkBody("password", "Password is required!").notEmpty();
		req.checkBody("password2", "Passwords do not match!").equals(password);

		var errors = req.validationErrors();

		if (errors) {
			res.render("register", {
				errors: errors,
				user: null,
				title: "Register",
			});
		} else {
			User.findOne({ username: username }, function (err, user) {
				if (err) console.log(err);

				if (user) {
					req.flash("danger", "Username exists, choose another!");
					res.redirect("/users/register");
				} else {
					var user = new User({
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
									req.flash("success", "You are now registered!");
									res.redirect("/users/login");
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

		res.render("login", {
			title: "Log in",
		});
	}

	/*
	 * POST login
	 */
	postLogin(req, res, next) {
		passport.authenticate("local", {
			successRedirect: "/",
			failureRedirect: "/users/login",
			failureFlash: true,
		})(req, res, next);
	}

	/*
	 * GET logout
	 */
	logout(req, res) {
		req.logout();

		req.flash("success", "You are logged out!");
		res.redirect("/users/login");
	}
}

module.exports = new UserController();
