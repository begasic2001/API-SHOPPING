const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categories = new Schema({
	title: {
		type: String,
		required: true,
	},
	slug: String,
});

module.exports = mongoose.model("categories", categories);
