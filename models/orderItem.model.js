const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: { type: Number, required: true },
  priceAtTime: { type: Number, required: true },
});
module.exports = mongoose.model("OrderItem", orderItemSchema);
