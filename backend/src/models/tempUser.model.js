import mongoose, { Schema } from "mongoose";

const tempUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["participant", "organizer"],
    },
    // Participant specific fields
    name: {
      type: String,
      required: function () {
        return this.userType === "participant";
      },
    },
    collegeName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: function () {
        return this.userType === "participant";
      },
    },
    rollNo: {
      type: String,
      required: function () {
        return this.userType === "participant";
      },
    },
    // Organizer specific fields
    clubName: {
      type: String,
      trim: true,
      lowercase: true,
      required: function () {
        return this.userType === "organizer";
      },
    },
    // OTP fields
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    maxOtpAttempts: {
      type: Number,
      default: 5,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    // Resend OTP tracking
    lastOtpSent: {
      type: Date,
      default: Date.now,
    },
    resendAttempts: {
      type: Number,
      default: 0,
    },
    maxResendAttempts: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
    // Auto-delete documents after 15 minutes
    expireAfterSeconds: 900,
  }
);

// Index for faster queries
tempUserSchema.index({ email: 1, userType: 1 });
tempUserSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

export const TempUser = mongoose.model("TempUser", tempUserSchema);
