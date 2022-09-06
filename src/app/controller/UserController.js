const Page = require("../model/page");
const Product = require("../model/product");
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
	getAllProduct(req,res,next){
		Product.find({})
			.then((products) => {
				res.render("user/all_product", {
					products,
					title:"ALL PRODUCT"
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = new UserController();
