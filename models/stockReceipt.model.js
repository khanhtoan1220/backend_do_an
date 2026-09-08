const mongoose = require("mongoose");
const stockReceiptSchema = new mongoose.Schema({
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
  },
  //soluong
  quantityAdded: {
    type: Number,
    required: true,
  },
  //gia nhap
  importPrice: {
    type: Number,
  },
  totalCost: Number,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("StockReceipt", stockReceiptSchema);
