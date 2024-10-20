import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js";
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
  // take the details provided by the user
  const { name, email, password, college, semister, rollNo } = req.body;

  // verify the details
  console.log(req.body);

  if (
    [name, email, password, college, semister, rollNo].some(
      (field) => !field || field === ""
    )
  ) {
    throw new ApiError(400, "Please enter all the required credentials");
  }

  // validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  // check if the email already exists or not
  const existedUser = await Student.findOne({
    email,
  });
  if (existedUser) {
    throw new ApiError(400, "An email ID already exists");
  }

  // create the participant object in DB
  const student = await Student.create({
    name,
    email,
    password,
    college,
    semister,
    role: "student",
    rollNo,
  });

  // remove the password from the response
  const createdStudent = await Student.findById(student._id).select(
    "-password"
  );

  // check if the user got created or not
  if (!createdStudent) {
    throw new ApiError(
      500,
      "Something went wrong while making the entry in the DB"
    );
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdStudent, "User registered successfully"));
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
    throw new ApiError(400, "Club already exists with this email");
  }

  // create the club entry in DB
  const club = await Club.create({
    clubName,
    collegeName,
    email,
    role: "organizer",
    password,
  });

  // remove the password from response
  const createdClub = await Club.findById(club._id).select("-password");

  // check for club creation
  if (!createdClub) {
    throw new ApiError(
      500,
      "Something went wrong while making the entry in DB"
    );
  }

  // return success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdClub, "Club created successfully"));
});

// for participant login
const participantLogin = asyncHandler(async (req, res) => {
  // get the user data
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password is required");
  }
  // check if email already exists or not
  // find the user
  const student = await Student.findOne({ email });

  if (!student) {
    throw new ApiError(400, "user does not exist");
  }

  // check if password is correct or not
  const validPassword = student.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Password is incorrect");
  }
  // access refresh token
  const { accessToken, refreshToken } = await generateRefreshAccessTokenStudent(
    student._id
  );
  // send cookie
  const loggedInStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  // cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  // if everything is fine then login
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refeshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInStudent,
          refreshToken,
          accessToken,
        },
        "participant Logged in successfully"
      )
    );
});

// for organizer login
const organizerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please enter email and password");
  }

  const organizer = await Club.findOne({ email });
  if (!organizer) {
    throw new ApiError(400, "User does not exist");
  }

  const validPassword = organizer.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Password is incorrect!");
  }

  const { refreshToken, accessToken } =
    await generateRefreshAccessTokenOrganizer(organizer._id);

  const loggedInOrganizer = await Club.findById(organizer._id).select(
    "-password -refreshToken"
  );

  // cookies
  const options = {
    httpOnly: true,
    secure: true, // Make sure to only set this to true in production (HTTPS)
    sameSite: "None", // This can help with cross-site requests
    maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration time, e.g., 1 day
  };
  // if everything is fine then login
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInOrganizer,
          refreshToken,
          accessToken,
        },
        "organizer Logged in successfully"
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
  // get the user id
  // get the user details,
  // get the updated fields form the body
  // check if user exists or not
  // if its a student then update on the student
  // if its a organizer then update on the organizer

  const userId = req.user._id;
  const role = req.user.role;
  const { ...updatedFields } = req.body;

  let user;
  if (role === "student") {
    user = await Student.findById(userId);
  } else if (role === "organizer") {
    user = await Organizer.findById(userId);
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (Object.keys(updatedFields).length > 0) {
    Object.keys(updatedFields).forEach((key) => {
      if (user[key] !== updatedFields[key]) {
        user[key] = updatedFields[key];
      }
    });
  }

  await user.save();
  res.status(200).json(new ApiResponse("Updates successfully", user));
});

export {
  registerClub,
  registerParticipant,
  participantLogin,
  organizerLogin,
  logoutUser,
  refreshAcessTokenStudent,
  refreshAcessTokenOrganizer,
  viewProfile,
  updateProfile,
};
