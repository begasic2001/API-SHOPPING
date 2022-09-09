const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const Page = require("./src/app/model/page");
const Category = require("./src/app/model/category");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const database = require("./src/config/database");
const route = require("./src/router/index");
const app = express();

const port = process.env.PORT || 9000;
app.use(methodOverride("_method"));
app.use(cors());
// logger morgan
app.use(morgan("combined"));
// file upload
app.use(fileUpload());
// use session save cart
app.use(
	session({
		secret: process.env.SECRET_SESSION,
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false },
	}),
);
app.use(cookieParser());
app.get("*", function (req, res, next) {
	res.locals.cart = req.session.cart;
	res.locals.user = req.user || null
	next();
});
// Get all pages to pass to header.ejs
Page.find({})
	.sort({ sorting: 1 })
	.exec(function (err, pages) {
		if (err) {
			console.log(err);
		} else {
			app.locals.pages = pages;
		}
	});

// Get Category Model

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
	if (err) {
		console.log(err);
	} else {
		app.locals.categories = categories;
	}
});
// read body form client
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.json());
// Passport Config
require("./src/config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// connect db
database.connect();

// init view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
// static file
app.use(express.static(path.join(__dirname, "src/public")));
route(app);
app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
