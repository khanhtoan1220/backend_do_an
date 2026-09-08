const express = require("express");
const router = express.Router();

// Import các sub-routers
const categoryRouter = require("./category.route");
const ingredientRouter = require("./ingredient.route");
const menuItemRouter = require("./menuItem.route");
const orderRouter = require("./order.route");
const orderItemRouter = require("./orderItem.route");
const orderLogRouter = require("./orderLog.route");
const recipeItemRouter = require("./recipeItem.route");
const stockReceiptRouter = require("./stockReceipt.route");
const authRouter = require("./auth.route");

// Khai báo sử dụng các router trực tiếp (ĐÃ XÓA CHỮ WRAP BÊN NGOÀI)
router.use("/category", categoryRouter);
router.use("/ingredient", ingredientRouter);
router.use("/menuitem", menuItemRouter);
router.use("/order", orderRouter);
router.use("/order-item", orderItemRouter);
router.use("/order-log", orderLogRouter);
router.use("/recipe-item", recipeItemRouter);
router.use("/stock-receipt", stockReceiptRouter);
router.use("/auth", authRouter);

module.exports = router;
