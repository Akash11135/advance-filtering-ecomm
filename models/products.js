import { model, models, mongoose, Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  images: [{ type: String }],
});

export const Product = models.Product || model("Product", ProductSchema);
