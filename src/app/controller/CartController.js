const Product = require("../model/product");
const Category = require("../model/category");
var cart = [];
const addToCart = (req, res, next) => {
	return new Promise((resolve, reject) => {
		var slug = req.params.product;
		
		Product.findOne({ slug: slug }, function (err, p) {
			if (err) console.log(err);
			if (typeof req.cookies.cart == "undefined") {
				// req.session.cart = [];

				cart.push({
					title: slug,
					qty: 1,
					price: parseFloat(p.price).toFixed(2),
					image: "/product_images/" + p._id + "/" + p.image,
				});
				res.cookie("cart", cart);
				// req.session.cart.push({
				// 	title: slug,
				// 	qty: 1,
				// 	price: parseFloat(p.price).toFixed(2),
				// 	image: "/product_images/" + p._id + "/" + p.image,
				// });
			} else {
				var cart1 = req.cookies.cart;
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
					// cart1.push({
					// 	title: slug,
					// 	qty: 1,
					// 	price: parseFloat(p.price).toFixed(2),
					// 	image: "/product_images/" + p._id + "/" + p.image,
					// });
				}
				res.cookie("cart", cart1);
			}
			res.redirect("back");
		});
	});
};
const checkout = (req, res, next) => {
	return new Promise((resolve, reject) => {
		if (req.cookies.cart && req.cookies.cart.length == 0) {
			res.clearCookie("cart");
			res.redirect("/cart/checkout");
		} else {
			res.render("user/checkout", {
				title: "Checkout",
				cart: req.cookies.cart,
			});
		}
	});
};

/*
 * GET update product
 */
const updateProduct = (req, res) => {
	var slug = req.params.product;
	 let cart1 = req.cookies.cart;
	var action = req.query.action;

	for (var i = 0; i < cart1.length; i++) {
		if (cart1[i].title == slug) {
			switch (action) {
				case "add":
					cart1[i].qty++;
					res.cookie("cart", cart1);
					break;
				case "remove":
					cart1[i].qty--;
					res.cookie("cart", cart1);
					// console.log(cart)
					// cart.splice(i, 1);
					// if (cart[i].qty < 1) {
					// 	res.clearCookie("cart");
					// }
					break;
				case "clear":
					// cart.splice(i, 1);
					// if (cart.length == 0) 
					res.clearCookie("cart");
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
	res.clearCookie("cart");
	res.redirect("/cart/checkout");
};

/*
 * GET buy now
 */
const buyNow = (req, res) => {
	res.clearCookie("cart");

	res.sendStatus(200);
};
module.exports = {
	addToCart,
	checkout,
	updateProduct,
	clear,
	buyNow,
};
