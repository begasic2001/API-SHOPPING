const Page = require("../model/page");
class UserController {
	home(req, res, next) {
		Page.find({})
			.sort({ sorting: 1 })
			.then((pages) => {
				res.render("user/index");
			})
			.catch((err) => {
				console.log(err);
			});
	}
	showPage(req, res, next) {
		let slug = req.params.slug;
		Page.findOne({ slug })
			.then((pages) => {
				res.render("user/index", {
					pages,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = new UserController();
