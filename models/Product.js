import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  categories: {
    type: String,
  },
  weight: {
    type: Number,
  },
  title: {
    type: String,
  },
  calories: {
    type: Number,
  },
  groupBloodNotAllowed: {
    type: Boolean,
  },
});

const Product = model("Product", schema);

export default Product;
