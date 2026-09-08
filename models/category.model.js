const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("menuItems", {
  ref: "MenuItem",
  localField: "_id",
  foreignField: "categoryId",
});
module.exports = mongoose.model("Category", categorySchema);
