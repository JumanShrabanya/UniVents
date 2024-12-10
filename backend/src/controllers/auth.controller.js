// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const student = await Student.findOne({ email: decoded.email });

    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mark as verified
    student.isVerified = true;
    student.verificationToken = null; // Remove the token once verified
    await student.save();

    res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export { verifyEmail };
