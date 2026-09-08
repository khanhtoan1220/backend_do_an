const Ingredient = require("../models/ingredient.model");
exports.post = async (req, res) => {
  try {
    const data = req.body;
    const newIngredient = await Ingredient.create(data);
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().populate({
      path: "recipeItems",
      populate: { path: "menuItemId", select: "name" },
    });
    res.json(ingredients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedIngredient = await Ingredient.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (updatedIngredient) {
      res.json(updatedIngredient);
    } else {
      res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedIngredient = await Ingredient.findByIdAndDelete(id);
    if (deletedIngredient) {
      res.json({ message: "Delete successfully" });
    } else {
      res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getbyID = async (req, res) => {
  try {
    const id = req.params.id;

    const ingredient = await Ingredient.findById(id).populate({
      path: "recipeItems",
      populate: { path: "menuItemId", select: "name" },
    });

    if (ingredient) {
      res.json(ingredient);
    } else {
      res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
