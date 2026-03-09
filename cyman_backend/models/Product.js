import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }]
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "unisex"], default: "unisex" },
    variants: [variantSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);