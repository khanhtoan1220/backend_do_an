const mongoose = require("mongoose");
const orderLogSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  oldStatus: String,
  newStatus: String,
  reason: String, //ly do
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("OrderLog", orderLogSchema);
