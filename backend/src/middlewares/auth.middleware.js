import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js";

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    console.log("JWT token:", token);

    // Log the secret to verify if it exists
    console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);

    let decodedInfo;

    // Ensure jwt.verify doesn't crash the app
    try {
      decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      console.error("Error during JWT verification:", error.message);
      throw new ApiError(401, "Invalid access token");
    }

    let user;
    user = await Student.findById(decodedInfo?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      user = await Club.findById(decodedInfo?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.club = user; // Attach the club data to request object
    } else {
      req.student = user; // Attach the student data to request object
    }

    next();
  } catch (error) {
    // Log the error with token info for better debugging
    console.error("JWT Verification Error:", error.message);
    console.error(
      "Malformed token:",
      req.cookies?.accessToken || req.header("Authorization")
    );

    // Pass the error forward to a global error handler or throw ApiError
    next(new ApiError(401, error.message || "Invalid access token"));
  }
});
