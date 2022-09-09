const userRouter = require("./user");
const pageRouter = require("./page");
const categoryRouter = require("./category");
const productRouter = require("./product");
const productUserRouter = require("./productUser");
const CartRouter = require("./cart");
function route(app) {
	app.use("/user", userRouter);
	app.use("/api/page", pageRouter);
	app.use("/api/categories", categoryRouter);
	app.use("/api/product", productRouter);
	app.use("/products", productUserRouter);
	app.use("/cart", CartRouter);
}

module.exports = route;
