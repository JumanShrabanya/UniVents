import { Router } from "express";
import {
  registerUserWithOTP,
  verifyOTP,
  resendOTP,
  getOTPStatus,
} from "../controllers/otp.controller.js";

const router = Router();

// Register user and send OTP
router.post("/register", registerUserWithOTP);

// Verify OTP
router.post("/verify", verifyOTP);

// Resend OTP
router.post("/resend", resendOTP);

// Get OTP status
router.get("/status", getOTPStatus);

export default router;
