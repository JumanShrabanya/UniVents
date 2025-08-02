import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TempUser } from "../models/tempUser.model.js";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js";
import {
  generateOTP,
  sendOTPEmail,
  validateOTP,
  isOTPExpired,
  getOTPTimeRemaining,
} from "../utils/otpService.js";

// Register user and send OTP
const registerUserWithOTP = asyncHandler(async (req, res) => {
  // Check if JWT secret is available
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("ACCESS_TOKEN_SECRET is not set!");
    throw new ApiError(500, "Server configuration error");
  }

  const { email, password, userType, ...otherData } = req.body;

  // Validate required fields based on user type
  if (!email || !password || !userType) {
    throw new ApiError(400, "Email, password, and user type are required");
  }

  if (userType === "participant") {
    if (
      !otherData.name ||
      !otherData.collegeName ||
      !otherData.semester ||
      !otherData.rollNo
    ) {
      throw new ApiError(
        400,
        "Name, college name, semester, and roll number are required for participants"
      );
    }
  } else if (userType === "organizer") {
    if (!otherData.collegeName || !otherData.clubName) {
      throw new ApiError(
        400,
        "College name and club name are required for organizers"
      );
    }
  } else {
    throw new ApiError(
      400,
      "Invalid user type. Must be 'participant' or 'organizer'"
    );
  }

  // Check if user already exists in main models
  const existingStudent = await Student.findOne({ email });
  const existingClub = await Club.findOne({ email });

  if (existingStudent || existingClub) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Check if user already exists in temp model
  const existingTempUser = await TempUser.findOne({ email, userType });
  if (existingTempUser) {
    // Delete existing temp user
    await TempUser.findByIdAndDelete(existingTempUser._id);
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create temp user with validated data
  const tempUserData = {
    email,
    password,
    userType,
    otp,
    otpExpiry,
    collegeName: otherData.collegeName,
  };

  // Add user type specific fields
  if (userType === "participant") {
    tempUserData.name = otherData.name;
    tempUserData.semester = otherData.semester;
    tempUserData.rollNo = otherData.rollNo;
  } else if (userType === "organizer") {
    tempUserData.clubName = otherData.clubName;
  }

  const tempUser = await TempUser.create(tempUserData);

  // Send OTP email
  try {
    await sendOTPEmail(email, otp);
  } catch (error) {
    // Delete temp user if email fails
    await TempUser.findByIdAndDelete(tempUser._id);
    throw new ApiError(500, "Failed to send OTP email");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { email, userType }, "OTP sent successfully"));
});

// Verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
  // Check if JWT secret is available
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("ACCESS_TOKEN_SECRET is not set!");
    throw new ApiError(500, "Server configuration error");
  }

  const { email, userType, otp } = req.body;

  if (!email || !userType || !otp) {
    throw new ApiError(400, "Email, user type, and OTP are required");
  }

  // Validate OTP format
  if (!validateOTP(otp)) {
    throw new ApiError(400, "Invalid OTP format");
  }

  // Find temp user
  const tempUser = await TempUser.findOne({ email, userType });
  if (!tempUser) {
    throw new ApiError(404, "User not found or OTP expired");
  }

  // Check if OTP is expired
  if (isOTPExpired(tempUser.otpExpiry)) {
    await TempUser.findByIdAndDelete(tempUser._id);
    throw new ApiError(400, "OTP has expired");
  }

  // Check OTP attempts
  if (tempUser.otpAttempts >= tempUser.maxOtpAttempts) {
    await TempUser.findByIdAndDelete(tempUser._id);
    throw new ApiError(400, "Too many OTP attempts. Please register again");
  }

  // Verify OTP
  if (tempUser.otp !== otp) {
    tempUser.otpAttempts += 1;
    await tempUser.save();
    throw new ApiError(
      400,
      `Invalid OTP. ${
        tempUser.maxOtpAttempts - tempUser.otpAttempts
      } attempts remaining`
    );
  }

  // OTP is correct - create user in main model
  let user;
  if (userType === "participant") {
    user = await Student.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      collegeName: tempUser.collegeName,
      semester: tempUser.semester,
      rollNo: tempUser.rollNo,
      role: "student",
      isVerified: true,
    });
  } else if (userType === "organizer") {
    user = await Club.create({
      clubName: tempUser.clubName,
      collegeName: tempUser.collegeName,
      email: tempUser.email,
      password: tempUser.password,
      role: "organizer",
      isVerified: true,
    });
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  console.log("Generated tokens:", {
    accessToken: accessToken ? "present" : "missing",
    refreshToken: refreshToken ? "present" : "missing",
  });

  // Update user with refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Delete temp user
  await TempUser.findByIdAndDelete(tempUser._id);

  // Set cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  console.log("Cookie options:", options);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Email verified successfully"
      )
    );
});

// Resend OTP
const resendOTP = asyncHandler(async (req, res) => {
  const { email, userType } = req.body;

  if (!email || !userType) {
    throw new ApiError(400, "Email and user type are required");
  }

  // Find temp user
  const tempUser = await TempUser.findOne({ email, userType });
  if (!tempUser) {
    throw new ApiError(404, "User not found");
  }

  // Check resend attempts
  if (tempUser.resendAttempts >= tempUser.maxResendAttempts) {
    throw new ApiError(
      400,
      "Maximum resend attempts reached. Please register again"
    );
  }

  // Check time between resends (minimum 60 seconds)
  const timeSinceLastSend = Date.now() - tempUser.lastOtpSent.getTime();
  if (timeSinceLastSend < 60000) {
    const remainingTime = Math.ceil((60000 - timeSinceLastSend) / 1000);
    throw new ApiError(
      400,
      `Please wait ${remainingTime} seconds before requesting another OTP`
    );
  }

  // Generate new OTP
  const newOtp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Update temp user
  tempUser.otp = newOtp;
  tempUser.otpExpiry = otpExpiry;
  tempUser.otpAttempts = 0;
  tempUser.lastOtpSent = new Date();
  tempUser.resendAttempts += 1;
  await tempUser.save();

  // Send new OTP
  try {
    await sendOTPEmail(email, newOtp);
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP resent successfully"));
});

// Get OTP status (for frontend to check if user exists and get time remaining)
const getOTPStatus = asyncHandler(async (req, res) => {
  const { email, userType } = req.query;

  if (!email || !userType) {
    throw new ApiError(400, "Email and user type are required");
  }

  const tempUser = await TempUser.findOne({ email, userType });
  if (!tempUser) {
    throw new ApiError(404, "User not found");
  }

  const timeRemaining = getOTPTimeRemaining(tempUser.otpExpiry);
  const canResend = Date.now() - tempUser.lastOtpSent.getTime() >= 60000;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        timeRemaining,
        canResend,
        resendAttemptsRemaining:
          tempUser.maxResendAttempts - tempUser.resendAttempts,
        otpAttemptsRemaining: tempUser.maxOtpAttempts - tempUser.otpAttempts,
      },
      "OTP status retrieved successfully"
    )
  );
});

export { registerUserWithOTP, verifyOTP, resendOTP, getOTPStatus };
