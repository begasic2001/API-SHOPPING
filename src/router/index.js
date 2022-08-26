const userRouter = require("./user");
const pageRouter = require("./page");
const categoryRouter = require("./category");
const productRouter = require("./product");
function route(app) {
	app.use("/user", userRouter);
	app.use("/api/page", pageRouter);
	app.use("/api/categories", categoryRouter);
	app.use("/api/product", productRouter);
}

module.exports = route;
