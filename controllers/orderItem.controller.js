const OrderItem = require("../models/orderItem.model");
const Order = require("../models/order.model");

exports.getAll = async (req, res) => {
  try {
    const items = await OrderItem.find().populate("menuItemId", "name price");
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getbyID = async (req, res) => {
  try {
    const item = await OrderItem.findById(req.params.id).populate("menuItemId");
    if (!item) return res.status(404).json({ message: "OrderItem not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { quantity } = req.body;
    const orderItem = await OrderItem.findById(req.params.id);
    if (!orderItem)
      return res.status(404).json({ message: "OrderItem not found" });

    //cap nhat so luong
    orderItem.quantity = quantity;
    await orderItem.save();

    //tinh lai tog tien order
    const allItems = await OrderItem.find({ orderId: orderItem.orderId });
    const newTotal = allItems.reduce(
      (sum, i) => sum + i.quantity * i.priceAtTime,
      0,
    );

    await Order.findByIdAndUpdate(orderItem.orderId, { totalAmount: newTotal });

    res.json({
      message: "Updated successfully",
      data: orderItem,
      newTotalAmount: newTotal,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id);
    if (!orderItem)
      return res.status(404).json({ message: "OrderItem not found" });

    const orderId = orderItem.orderId;
    await OrderItem.findByIdAndDelete(req.params.id);

    // tinh lai tong tien sau khi xoa mon
    const allItems = await OrderItem.find({ orderId: orderId });
    const newTotal = allItems.reduce(
      (sum, i) => sum + i.quantity * i.priceAtTime,
      0,
    );

    await Order.findByIdAndUpdate(orderId, { totalAmount: newTotal });

    res.json({
      message: "Item removed, order total updated",
      newTotalAmount: newTotal,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
