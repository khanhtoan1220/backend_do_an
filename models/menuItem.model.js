const mongoose = require("mongoose");
const menuItemSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

menuItemSchema.virtual("recipeItems", {
  ref: "RecipeItem",
  localField: "_id",
  foreignField: "menuItemId",
});
module.exports = mongoose.model("MenuItem", menuItemSchema);
