import mongoose, { Schema } from "mongoose";

const registrationSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
});

export const Registration = mongoose.model("Registration", registrationSchema);
