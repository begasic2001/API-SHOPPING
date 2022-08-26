const { body, validationResult } = require("express-validator");
const Product = require("../model/product");
const Category = require("../model/category");
var mkdirp = require("mkdirp");
var resizeImg = require("resize-img");
const fs = require("fs-extra");
class ProductController {
	//product
	//get product page
	product(req, res, next) {
		let count;
		Product.count(function (err, c) {
			count = c;
		});
		Product.find({})
			.then((products) => {
				res.render("admin/product", {
					products,
					count,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	addProduct(req, res, next) {
		let title = "";
		let desc = "";
		let price = "";

		Category.find({}).then((categories) => {
			res.render("admin/add-product", {
				title,
				desc,
				price,
				categories,
			});
		});
	}
	postAddProduct(req, res, next) {
		let imageFile;
		if (!(req.files && req.files.image)) {
			imageFile = "";
		}
		// if (!req?.files?.image) {

		// }
		// if (!req.files || Object.keys(req.files).length === 0 || req.files === null ) {
		// 	imageFile = "";
		else {
			imageFile = req.files.image.name;
		}
		let title = req.body.title;
		let desc = req.body.desc;
		let price = req.body.price;
		let category = req.body.category;
		let slug = title.replace(/\s+/g, "-").toLowerCase();
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			Category.find({}).then((categories) => {
				res.render("admin/add-product", {
					alert,
					title,
					desc,
					price,
					categories,
				});
			});
		} else {
			Product.findOne({
				slug,
			})
				.then((product) => {
					if (product) {
						Category.find({}).then((categories) => {
							res.render("admin/add-product", {
								title,
								desc,
								price,
								categories,
							});
						});
					} else {
						let price2 = parseFloat(price).toFixed(2);
						Product.create({
							title,
							slug,
							desc,
							price: price2,
							category,
							image: imageFile,
						})
							.then((data) => {
								mkdirp(`src/public/product_images/` + data._id).then(() => {
									mkdirp(
										`src/public/product_images/` + data._id + "/gallery",
									).then(() => {
										mkdirp(
											`src/public/product_images/` +
												data._id +
												"/gallery/thumbs",
										).then(() => {
											if (imageFile != "") {
												var productImage = req.files.image;
												var path =
													`src/public/product_images/` +
													data._id +
													"/" +
													data.image;
												productImage.mv(path, function (err) {
													return console.log(err);
												});
												res.redirect("http://localhost:9000/api/product");
											}
										});
									});
								});
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	editProduct(req, res, next) {
		let errors;
		if (req.session.errors) {
			errors = req.session.errors;
		}
		req.session.errors = null;
		Category.find({})
			.then((categories) => {
				Product.findById(req.params.id).then((product) => {
					let galleryDir = `src/public/product_images/${product._id}/gallery`;
					let galleryImages = null;
					fs.readdir(galleryDir, function (err, files) {
						if (err) {
							console.log(err);
						} else {
							galleryImages = files;
							res.render("admin/edit-product", {
								title: product.title,
								desc: product.desc,
								price: parseFloat(product.price).toFixed(2),
								categories,
								category: product.category.replace(/\s+/g, "-").toLowerCase(),
								image: product.image,
								galleryImages,
								errors,
								id: product._id,
							});
						}
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	postEditProduct(req, res, next) {
		let imageFile;
		if (req.files) {
			imageFile = req.files.image.name;
		} else {
			imageFile = "";
		}
		let title = req.body.title;
		let desc = req.body.desc;
		let price = req.body.price;
		let category = req.body.category;
		let slug = title.replace(/\s+/g, "-").toLowerCase();
		let pimage = req.body.pimage;
		let id = req.params.id;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			//const alert = errors.array();
			req.session.errors = errors;
			res.redirect("/api/product/edit-product/" + id);
		} else {
			Product.findOne({ slug: slug, _id: { $ne: id } }, function (err, p) {
				if (err) console.log(err);
				if (p) {
					res.redirect("/admin/products/edit-product/" + id);
				} else {
					Product.findById(id, function (err, p) {
						if (err) console.log(err);

						p.title = title;
						p.slug = slug;
						p.desc = desc;
						p.price = parseFloat(price).toFixed(2);
						p.category = category;

						if (imageFile != "") {
							p.image = imageFile;
						}

						p.save(function (err) {
							if (err) console.log(err);

							if (imageFile != "") {
								if (pimage != "") {
									fs.remove(
										"src/public/product_images/" + id + "/" + pimage,
										function (err) {
											if (err) console.log(err);
										},
									);
								}

								let productImage = req.files.image;
								let path = "src/public/product_images/" + id + "/" + imageFile;

								productImage.mv(path, function (err) {
									return console.log(err);
								});
							}

							res.redirect("/api/product/edit-product/" + id);
						});
					});
				}
			});
		}
	}
	/*
	 * POST product gallery
	 */
	postGalleryImage(req, res, next) {
		let productImage = req.files.file;
		let id = req.params.id;
		let path =
			"src/public/product_images/" + id + "/gallery/" + req.files.file.name;
		let thumbsPath =
			"src/public/product_images/" +
			id +
			"/gallery/thumbs/" +
			req.files.file.name;

		productImage.mv(path, function (err) {
			if (err) console.log(err);

			resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(
				function (buf) {
					fs.writeFileSync(thumbsPath, buf);
				},
			);
		});

		res.sendStatus(200);
	}
	/*
	 * GET delete image
	 */
	postDeleteImage(req, res, next) {
		let originalImage =
			"src/public/product_images/" +
			req.query.id +
			"/gallery/" +
			req.params.image;
		let thumbImage =
			"src/public/product_images/" +
			req.query.id +
			"/gallery/thumbs/" +
			req.params.image;

		fs.remove(originalImage, function (err) {
			if (err) {
				console.log(err);
			} else {
				fs.remove(thumbImage, function (err) {
					if (err) {
						console.log(err);
					} else {
						res.redirect("/api/product/edit-product/" + req.query.id);
					}
				});
			}
		});
	}
	postDeleteProduct(req, res, next) {
		Product.findByIdAndDelete({
			_id: req.params.id,
		})
			.then(() => {
				res.redirect("/api/product/");
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
module.exports = new ProductController();
