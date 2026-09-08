const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const MenuItem = require("../models/menuItem.model");
const OrderLog = require("../models/orderLog.model");

exports.post = async (req, res) => {
  try {
    const { items, customerId, orderType, note, staffId } = req.body;
    let totalAmount = 0;

    // 1. Tạo mã đơn hàng ngẫu nhiên
    const orderCode = "ORD" + Date.now();

    // 2. Tạo đơn hàng tạm để lấy ID
    const newOrder = new Order({
      code: orderCode,
      customerId,
      orderType,
      note,
      staffId,
      totalAmount: 0, // Sẽ cập nhật sau khi tính toán
    });

    const savedOrder = await newOrder.save();

    // 3. Duyệt qua từng món khách đặt, lấy giá thực tế từ DB và tạo OrderItem
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem)
        throw new Error(`Món ăn ID ${item.menuItemId} không tồn tại`);

      const itemPrice = menuItem.price * item.quantity;
      totalAmount += itemPrice;

      await OrderItem.create({
        orderId: savedOrder._id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtTime: menuItem.price,
      });
    }

    // 4. Cập nhật lại tổng tiền chính xác vào Order
    savedOrder.totalAmount = totalAmount;
    await savedOrder.save();

    // 5. Ghi nhật ký khởi tạo
    await OrderLog.create({
      orderId: savedOrder._id,
      newStatus: "pending",
      reason: "Khởi tạo đơn hàng",
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name")
      .populate("orderItems")
      .populate("orderLogs");
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getbyID = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems")
      .populate("orderLogs")
      .populate({
        path: "orderItems",
        populate: { path: "menuItemId", select: "name image" },
      });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, reason, staffId } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate({
      path: "orderItems",
      populate: {
        path: "menuItemId",
        populate: { path: "recipeItems" },
      },
    });

    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    const oldStatus = order.status;

    // TRƯỜNG HỢP 1: XÁC NHẬN ĐƠN (Trừ kho)
    if (status === "confirmed" && oldStatus === "pending") {
      const Ingredient = require("../models/ingredient.model");

      // Kiểm tra tồn kho trước khi trừ
      for (const item of order.orderItems) {
        for (const recipe of item.menuItemId.recipeItems) {
          const ingredient = await Ingredient.findById(recipe.ingredientId);
          const totalNeeded = recipe.quantityNeeded * item.quantity;
          if (ingredient.quantity < totalNeeded) {
            throw new Error(
              `Không đủ nguyên liệu: ${ingredient.name} (Cần ${totalNeeded}${ingredient.unit}, hiện có ${ingredient.quantity}${ingredient.unit})`,
            );
          }
        }
      }

      // Thực hiện trừ kho
      for (const item of order.orderItems) {
        for (const recipe of item.menuItemId.recipeItems) {
          await Ingredient.findByIdAndUpdate(recipe.ingredientId, {
            $inc: { quantity: -(recipe.quantityNeeded * item.quantity) },
          });
        }
      }
    }

    // TRƯỜNG HỢP 2: HỦY ĐƠN (Hoàn tồn nếu đã trừ kho)
    if (
      status === "cancelled" &&
      ["confirmed", "preparing", "completed"].includes(oldStatus)
    ) {
      const Ingredient = require("../models/ingredient.model");
      for (const item of order.orderItems) {
        for (const recipe of item.menuItemId.recipeItems) {
          await Ingredient.findByIdAndUpdate(recipe.ingredientId, {
            $inc: { quantity: recipe.quantityNeeded * item.quantity },
          });
        }
      }
    }

    // Cập nhật trạng thái mới
    order.status = status;
    await order.save();

    // Ghi log nhật ký
    const OrderLog = require("../models/orderLog.model");
    await OrderLog.create({
      orderId: order._id,
      staffId,
      oldStatus,
      newStatus: status,
      reason,
    });

    res.json({
      message: `Cập nhật trạng thái sang ${status} thành công`,
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
