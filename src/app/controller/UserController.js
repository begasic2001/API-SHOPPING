const Page = require("../model/page");
const Product = require("../model/product");
var mkdirp = require("mkdirp");
var resizeImg = require("resize-img");
const fs = require("fs-extra");
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
	getProductByCategory(req,res,next){
		const category = req.params.category
		Product.find({category})
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
	getProductDetail(req,res,next){
		let galleryImages = null
		Product.findOne({slug:req.params.product})
		.then(product =>{
			let galleryDir = `src/public/product_images/${product._id}/gallery`
			fs.readdir(galleryDir,function(err,files){
				galleryImages = files
				res.render('user/product',{
					galleryImages,
					p:product,
					title:product.title
				})
			})
		})
		.catch()
	}
}

module.exports = new UserController();
