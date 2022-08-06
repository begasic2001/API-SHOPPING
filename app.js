const express = require("express");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const database = require("./src/config/database");
const route = require("./src/router/index");
const app = express();

const port = process.env.PORT || 9000;

app.use(cors());
// logger morgan
app.use(morgan("combined"));
// use session save cart
app.use(
	session({
		secret: process.env.SECRET_SESSION,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	}),
);
app.use(cookieParser());
app.use(flash());

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
