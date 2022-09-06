const userRouter = require("./user");
const pageRouter = require("./page");
const categoryRouter = require("./category");
const productRouter = require("./product");
const productUserRouter = require("./productUser");
function route(app) {
	app.use("/user", userRouter);
	app.use("/api/page", pageRouter);
	app.use("/api/categories", categoryRouter);
	app.use("/api/product", productRouter);
	app.use("/products", productUserRouter);
}

module.exports = route;
