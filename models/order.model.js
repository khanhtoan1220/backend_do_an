const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code: {
      type: String,
      required: true,
    },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderType: {
      type: String,
      enum: ["tai_quay", "mang_ve"],
      default: "tai_quay",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "completed", "cancelled"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true },
    note: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

orderSchema.virtual("orderItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "orderId",
});

orderSchema.virtual("orderLogs", {
  ref: "OrderLog",
  localField: "_id",
  foreignField: "orderId",
});
module.exports = mongoose.model("Order", orderSchema);
