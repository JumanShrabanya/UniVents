import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  categoryTitle: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
});

export const Category = mongoose.model("Category", categorySchema);
