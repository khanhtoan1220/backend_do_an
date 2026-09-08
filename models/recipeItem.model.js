const mongoose = require("mongoose");
const recipeItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
  quantityNeeded: { type: Number, required: true },
  //so luong nguyen lieu can cho mon
});
module.exports = mongoose.model("RecipeItem", recipeItemSchema);
