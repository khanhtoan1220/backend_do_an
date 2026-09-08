const OrderLog = require("../models/orderLog.model");

exports.getAll = async (req, res) => {
  try {
    const logs = await OrderLog.find().populate("staffId", "name");
    res.json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
