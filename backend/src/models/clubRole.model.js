import mongoose, { Schema } from "mongoose";

const clubRoleSchema = new Schema(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    roleName: {
      type: String,
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true }
);

export const ClubRole = mongoose.model("ClubRole", clubRoleSchema);
