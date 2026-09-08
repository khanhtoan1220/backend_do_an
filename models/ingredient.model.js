const mongoose = require("mongoose");
const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      //g,kg,ml, chai,...
    },
    minStock: {
      type: Number,
      default: 10,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ingredientSchema.virtual("recipeItems", {
  ref: "RecipeItem",
  localField: "_id",
  foreignField: "ingredientId",
});
module.exports = mongoose.model("Ingredient", ingredientSchema);
