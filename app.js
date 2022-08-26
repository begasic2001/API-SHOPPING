const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload")
const database = require("./src/config/database");
const route = require("./src/router/index");
const app = express();

const port = process.env.PORT || 9000;
app.use(methodOverride("_method"));
app.use(cors());
// logger morgan
app.use(morgan("combined"));
// file upload
app.use(fileUpload())
// use session save cart
app.use(
	session({
		secret: process.env.SECRET_SESSION,
		resave: true,
		saveUninitialized: true,
		// cookie: { secure: false },
	}),
);
app.use(cookieParser());
// read body form client
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.json());

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
