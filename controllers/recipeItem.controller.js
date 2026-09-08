const RecipeItem = require("../models/recipeItem.model");

exports.post = async (req, res) => {
  try {
    const newRecipe = await RecipeItem.create(req.body);
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const recipes = await RecipeItem.find()
      .populate("menuItemId", "name")
      .populate("ingredientId", "name unit");
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await RecipeItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await RecipeItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Delete successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
