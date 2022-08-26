const { body, validationResult } = require("express-validator");
const Page = require("../model/page");

class PageController {
	home(req, res, next) {
		Page.find({})
			.sort({ sorting: 1 })
			.then((pages) => {
				res.render("admin/page", {
					pages,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	addPages(req, res, next) {
		const title = "";
		const slug = "";
		const content = "";
		res.render("admin/add-page", {
			title,
			slug,
			content,
		});
	}
	// thêm page mới
	postaddPages(req, res, next) {
		// res.send("chuyen trang thanh cong")
		let title = req.body.title;
		let content = req.body.content;
		let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
		if (slug == "") slug = title.replace(/\s+/g, "-").toLowerCase();
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("admin/add-page", {
				alert,
			});
		} else {
			Page.findOne({
				slug,
			})
				.then((page) => {
					if (page) {
						res.render("admin/add-page", {
							title,
							slug,
							content,
						});
					} else {
						Page.create({
							title,
							slug,
							content,
							sorting: 0,
						}).then(() => {
							res.redirect("http://localhost:9000/api/page");
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	// cập nhật thứ tự sắp xếp page
	reorderPage(req, res, next) {
		// console.log(req.body)
		const ids = req.body.id;
		let count = 0;
		ids.map((id) => {
			count++;
			(function (count) {
				Page.findById({ _id: id }).then((page) => {
					page.sorting = count;
					return page.save();
				});
			})(count);
		});
	}
	// [get] sửa thông tin page
	editPage(req, res, next) {
		const slug = req.params.slug;

		Page.findOne({ _id: slug })
			.then((page) => {
				res.render("admin/edit-page", {
					title: page.title,
					slug: page.slug,
					content: page.content,
					id: page._id,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	// [put] sửa thông tin page
	posteditPages(req, res, next) {
		// res.send("chuyen trang thanh cong")
		const id = req.params.slug;
		let title = req.body.title;
		let content = req.body.content;
		let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
		if (slug == "") slug = title.replace(/\s+/g, "-").toLowerCase();
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("admin/edit-page", {
				alert,
			});
		} else {
			Page.findOne({
				slug,
				_id: { $ne: id },
			})
				.then((page) => {
					if (page) {
						res.render("admin/edit-page", {
							title,
							slug,
							content,
							id,
						});
					} else {
						Page.findByIdAndUpdate(id, {
							title,
							slug,
							content,
							sorting: 0,
						}).then((pages) => {
							res.redirect("/api/page/edit-page/" + pages._id);
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	detelePage(req, res, next) {
		Page.findByIdAndDelete({
			_id: req.params.slug,
		})
			.then(() => {
				res.redirect("/api/page/");
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
module.exports = new PageController();
