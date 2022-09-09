const Product = require("../model/product");
const Category = require("../model/category");
const addToCart = (req, res, next) => {
	return new Promise((resolve, reject) => {
		var slug = req.params.product;

		Product.findOne({ slug: slug }, function (err, p) {
			if (err) console.log(err);
			if (typeof req.session.cart == "undefined") {
				req.session.cart = [];
				req.session.cart.push({
					title: slug,
					qty: 1,
					price: parseFloat(p.price).toFixed(2),
					image: "/product_images/" + p._id + "/" + p.image,
				});
			} else {
				var cart1 = req.session.cart;
				console.log(typeof cart1);
				let newItem = true;
				for (let i = 0; i < cart1.length; i++) {
					if (cart1[i].title == slug) {
						cart1[i].qty++;
						newItem = false;
					}
				}
				if (newItem) {
					cart1.push({
						title: slug,
						qty: 1,
						price: parseFloat(p.price).toFixed(2),
						image: "/product_images/" + p._id + "/" + p.image,
					});
				}
			}
			res.redirect("back");
		});
	});
};
const checkout = (req, res, next) => {
	return new Promise((resolve, reject) => {
		if (req.session.cart && req.session.cart.length == 0) {
			delete req.session.cart;
			res.redirect("/cart/checkout");
		} else {
			res.render("user/checkout", {
				title: "Checkout",
				cart: req.session.cart,
			});
		}
	});
};

/*
 * GET update product
 */
const updateProduct = (req, res) => {
	var slug = req.params.product;
	var cart = req.session.cart;
	var action = req.query.action;

	for (var i = 0; i < cart.length; i++) {
		if (cart[i].title == slug) {
			switch (action) {
				case "add":
					cart[i].qty++;
					break;
				case "remove":
					cart[i].qty--;
					if (cart[i].qty < 1) cart.splice(i, 1);
					break;
				case "clear":
					cart.splice(i, 1);
					if (cart.length == 0) delete req.session.cart;
					break;
				default:
					console.log("update problem");
					break;
			}
			break;
		}
	}

	res.redirect("/cart/checkout");
};

/*
 * GET clear cart
 */
const clear = (req, res) => {
	delete req.session.cart;
	res.redirect("/cart/checkout");
};

/*
 * GET buy now
 */
const buyNow = (req, res) => {
	delete req.session.cart;

	res.sendStatus(200);
};
module.exports = {
	addToCart,
	checkout,
	updateProduct,
	clear,
	buyNow,
};
