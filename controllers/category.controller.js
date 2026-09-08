const Category = require("../models/category.model");
exports.post = async (req, res) => {
  try {
    const data = req.body;
    const newCategory = await Category.create(data);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const listCategory = await Category.find()
      .populate({ path: "menuItems", match: { isAvailable: true } })
      .exec();
    res.json(listCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updateCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (updateCategory) {
      res.json(updateCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteCategory = await Category.findByIdAndDelete(id);
    if (deleteCategory) {
      res.json({ message: "Delete successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getbyID = async (req, res) => {
  try {
    const id = req.params.id;

    const get = await Category.findById(id).populate("menuItems");
    if (get) {
      res.json(get);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
