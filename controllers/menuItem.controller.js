const MenuItem = require("../models/menuItem.model");

exports.post = async (req, res) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate("categoryId", "name")
      .populate({
        path: "recipeItems",
        populate: { path: "ingredientId", select: "name unit" },
      });
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getbyID = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
      .populate("categoryId", "name")
      .populate({
        path: "recipeItems",
        populate: { path: "ingredientId", select: "name unit" },
      });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem)
      return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Delete successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
