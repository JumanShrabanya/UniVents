import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    availableSeats: {
      type: Number,
      min: 0,
    },
    availableFor: {
      type: String,
      enum: ["For Everyone", "College Only"],
      default: "For Everyone",
    },
    registrationAvailable: {
      type: Boolean,
      default: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    counterSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    collegeName: {
      type: String,
    },
    coverImg: {
      type: String,
      required: true,
    },
    winners: {
      type: [String],
      default: [""],
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
