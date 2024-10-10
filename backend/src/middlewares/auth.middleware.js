import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js"; // Fix: Add .js extension

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Remove await as jwt.verify is synchronous

    let user;
    // Check if the token belongs to a student
    user = await Student.findById(decodedInfo?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      // If not found in Student, check in Club (renamed from Organizer)
      user = await Club.findById(decodedInfo?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.club = user; // Attach club to request (renamed from organizer)
    } else {
      req.student = user; // Attach student to request
    }

    next();
  } catch (error) {
    // Log the error for debugging
    console.error("JWT Verification Error:", error);
    throw new ApiError(401, error.message || "Invalid access token");
  }
});
