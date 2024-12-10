import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";

// helper function for generating access and refresh token
const generateRefreshAccessTokenStudent = async (userId) => {
  try {
    const student = await Student.findById(userId);
    const refreshToken = student.generateRefreshToken();
    const accessToken = student.generateAccessToken();

    // save the refresh token
    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const generateRefreshAccessTokenOrganizer = async (userId) => {
  try {
    const organizer = await Club.findById(userId);
    const refreshToken = organizer.generateRefreshToken();
    const accessToken = organizer.generateAccessToken();

    organizer.refreshToken = refreshToken;
    await organizer.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong in organizer!", error);
  }
};

// for the participant registration
const registerParticipant = asyncHandler(async (req, res) => {
  const { name, email, password, collegeName, semester, rollNo } = req.body;

  // Validate inputs
  if (
    [name, email, password, collegeName, semester, rollNo].some(
      (field) => !field || field === ""
    )
  ) {
    throw new ApiError(400, "Please enter all the required credentials");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  // Check if email already exists
  const existingUser = await Student.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "Participant already exists with this email",
      success: false,
    });
  }

  // Create the participant in DB but set isVerified as false and generate a verification token
  const verificationToken = jwt.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  ); // Token expires in 1 day
  const student = await Student.create({
    name,
    email,
    password,
    collegeName,
    semester,
    role: "student",
    rollNo,
    isVerified: false,
    verificationToken, // Store the verification token
  });
  // refresh and access token for participant
  const { refreshToken, accessToken } = await generateRefreshAccessTokenStudent(
    student._id
  );
  // remove the password from the response
  const createdStudent = await Student.findById(student._id).select(
    "-password"
  );
  if (!createdStudent) {
    throw new ApiError(
      500,
      "Something went wrong while making the entry in the DB"
    );
  }

  // Send email verification
  await sendVerificationEmail(email, verificationToken); // Sends an email with the token

  const options = {
    httpOnly: true,
    secure: true, // Make sure to only set this to true in production (HTTPS)
    sameSite: "None", // This can help with cross-site requests
    maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration time, e.g., 1 day
  };

  // return response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { createdStudent, refreshToken, accessToken },
        "User registered successfully"
      )
    );
});

// for the club registration
const registerClub = asyncHandler(async (req, res) => {
  // get the club details
  const { clubName, collegeName, email, password } = req.body;

  // validate the details
  if (
    [clubName, collegeName, email, password].some(
      (item) => !item || item === ""
    )
  ) {
    throw new ApiError(400, "Please provide all the required details");
  }

  // validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  // check if the email already exists or not
  const existedClub = await Club.findOne({
    email,
  });
  if (existedClub) {
    return res.status(400).json({
      statusCode: 400,
      message: "Club already exists with this email",
      success: false,
      errors: [],
    });
  }

  // create the club entry in DB
  const club = await Club.create({
    clubName,
    collegeName,
    email,
    role: "organizer",
    password,
  });

  const { refreshToken, accessToken } =
    await generateRefreshAccessTokenOrganizer(club._id);

  // remove the password from response
  const createdClub = await Club.findById(club._id).select("-password");

  // check for club creation
  if (!createdClub) {
    throw new ApiError(
      500,
      "Something went wrong while making the entry in DB"
    );
  }

  // cookies
  const options = {
    httpOnly: true,
    secure: true, // Make sure to only set this to true in production (HTTPS)
    sameSite: "None", // This can help with cross-site requests
    maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration time, e.g., 1 day
  };

  // return success response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { createdClub, refreshToken, accessToken },
        "Club created successfully"
      )
    );
});

// login controller for both participant and organizer
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please enter email and password");
  }

  // to set the role
  let user = await Club.findOne({ email });
  let role = "organizer";

  if (!user) {
    user = await Student.findOne({ email });
    role = "student";
  }

  // if neither of them exists
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Password is incorrect!");
  }

  const { refreshToken, accessToken } =
    role === "organizer"
      ? await generateRefreshAccessTokenOrganizer(user._id)
      : await generateRefreshAccessTokenStudent(user._id);

  const loggedInUser =
    role === "organizer"
      ? await Club.findById(user._id).select("-password -refreshToken")
      : await Student.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true, // Make sure to only set this to true in production (HTTPS)
    sameSite: "None", // This can help with cross-site requests
    maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration time, e.g., 1 day
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        `${role} logged in successfully`
      )
    );
});

// for logging out the participant and organizer
const logoutUser = asyncHandler(async (req, res) => {
  // reset the refresh and access token
  if (req.student) {
    await Student.findByIdAndUpdate(
      req.student._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );
  } else {
    await Club.findByIdAndUpdate(
      req.club._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );
  }

  // remove the cookies

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User loged out"));
});

// access refresh Token for Student
const refreshAcessTokenStudent = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const student = await Student.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== student?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } =
      await generateRefreshAccessTokenStudent(student._id);
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

// access refresh Token for organizer
const refreshAcessTokenOrganizer = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const organizer = await Organizer.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== organizer?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } =
      await generateRefreshAccessTokenOrganizer(organizer._id);
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

// view profile
const viewProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  let user;

  if (role === "student") {
    user = await Student.findById(userId).select("-password -refreshToken");
  } else if (role === "organizer") {
    user = await Organizer.findById(userId).select("-password -refreshToken");
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user));
});

// edit prifile details
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.body.role;

  console.log("role from the update profile: ", role);
  console.log("user id from the update profile: ", userId);

  // Validate role
  if (!["student", "organizer"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // Fetch user based on role
  const user =
    role === "student"
      ? await Student.findById(userId)
      : await Club.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Define allowed fields for each role
  const allowedFields =
    role === "student"
      ? ["name", "semester", "rollNo", "collegeName"]
      : ["clubName", "collegeName"];

  // Update fields directly from req.body
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key) && req.body[key] !== undefined) {
      user[key] = req.body[key];
    }
  });

  // Save the updated user
  await user.save();

  // Respond with the updated user details
  res.status(200).json(new ApiResponse("Updated successfully", user));
});

// to check user is logged in or not
const checkAuthStatus = asyncHandler(async (req, res) => {
  // get the user id
  // generate the token
  // verify the user with the token
  // return the response

  const userId = req.user._id;
  console.log("id:   ", userId);

  const token = req.cookies.accessToken;
  if (!token) {
    throw new ApiError(401, "No token provided. Authorization denied.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = await Student.findById(userId).select("-password -refreshToken");
    if (!user) {
      user = await Club.findById(userId).select("-password -refreshToken");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { role: user.role, user }));
  } catch (error) {
    throw new ApiError(
      401,
      "Invalid token provided. Authorization denied.",
      error
    );
  }
});
export {
  registerClub,
  registerParticipant,
  userLogin,
  logoutUser,
  refreshAcessTokenStudent,
  refreshAcessTokenOrganizer,
  viewProfile,
  updateProfile,
  checkAuthStatus,
};
