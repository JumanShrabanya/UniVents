import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student", // Hardcoded to 'student'
      enum: ["student", "organizer"], // Ensures only valid roles are set
    },
    avatarImg: {
      type: String,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "ClubRole",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
// to encrypt the password
studentSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

// to verify the password is correct or not for login
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// for access Token
studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// for refresh token
studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Student = mongoose.model("Student", studentSchema);
