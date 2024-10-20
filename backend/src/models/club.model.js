import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const clubSchema = new Schema(
  {
    clubName: {
      type: String,
      required: true,
      trim: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      default: "student", // Hardcoded to 'student'
      enum: ["student", "organizer"], // Ensures only valid roles are set
    },
    password: {
      type: String,
      required: true,
    },
    logoImg: {
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

// for encrypting the password
clubSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

// for verifying the password for login
clubSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// for generating the access token
clubSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      clubName: this.clubName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// for generating refresh token
clubSchema.methods.generateRefreshToken = function () {
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
export const Club = mongoose.model("Club", clubSchema);
