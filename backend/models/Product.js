const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // User name
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    image: { type: String }, // Image path of review
  },
  { timestamps: true }
);

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, require: [true, "Name required"], unique: true },
    description: { type: String, required: [true, "Description required"] },
    price: { type: Number, required: [true, "Price required"] },
    image: { type: [String], required: [true, "Image is required"] },
    category: { type: String, required: [true, "Category is required"] },
    brand: { type: String, required: [true, "Brand is required"] },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    countInStock: {
      type: Number,
      required: [true, "Count In Stock required"],
      default: 0,
    },
    keyFeatures: { type: [String], required: [true, "Features is required"] },
    reviews: [reviewSchema], // <-- Add this
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
