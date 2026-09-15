const StockReceipt = require("../models/stockReceipt.model");
const Ingredient = require("../models/ingredient.model");

exports.post = async (req, res) => {
  try {
    const { ingredientId, quantityAdded, importPrice, createBy } = req.body;

    // tao phieu nhap
    const newReceipt = await StockReceipt.create({
      ingredientId,
      quantityAdded,
      importPrice,
      totalCost: quantityAdded * (importPrice || 0),
      createBy,
    });

    // cap nhat ton kho

    await Ingredient.findByIdAndUpdate(ingredientId, {
      $inc: { quantity: quantityAdded },
    });

    res.status(201).json(newReceipt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const receipts = await StockReceipt.find()
      .populate("ingredientId", "name unit")
      .populate("createBy", "name");
    res.json(receipts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
