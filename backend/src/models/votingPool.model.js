import mongoose, { Schema } from "mongoose";
const votingPoolSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ], // Options for voting
    optionCounters: [
      {
        option: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    participants: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        selectedOption: {
          type: String,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    endTime: {
      type: Date,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    collegeName: {
      type: String,
      required: true,
    },
    availableFor: {
      type: String,
      enum: ["For Everyone", "College Only"],
      required: true,
      default: "for everyone",
    },
  },
  { timestamps: true }
);

export const VotingPool = mongoose.model("VotingPool", votingPoolSchema);
