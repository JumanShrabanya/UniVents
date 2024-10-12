import mongoose, { Schema } from "mongoose";
// category enums
const categoryEnum = [
  "Academic",
  "Sports",
  "Cultural",
  "Technology",
  "Career",
  "Arts",
  "Music",
  "Science",
  "Literature",
  "Health & Wellness",
  "Business",
  "Social",
  "Environmental",
  "Volunteering",
  "Workshop",
  "Seminar",
  "Conference",
  "Networking",
  "Film & Media",
  "Food & Cuisine",
];

const categorySchema = new Schema({
  categoryTitle: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
    enum: categoryEnum,
  },
});
// Static method to get all predefined categories
categorySchema.statics.getPredefinedCategories = function() {
  return categoryEnum;
};

export const Category = mongoose.model("Category", categorySchema);
