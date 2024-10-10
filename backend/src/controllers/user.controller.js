import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js";

// helper function for generating access and refresh token
const generateRefreshAccessTokenStudent = async function (userId) {
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

const generateRefreshAccessTokenOrganizer = async function (userId) {
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
  const student = await Student.findOne({
    $or: [{ email }, { password }],
  });

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

  const organizer = await Club.findOne({
    $or: [{ email }, { password }],
  });
  if (!organizer) {
    throw new ApiError(400, "User does not exist");
  }

  const validPassword = organizer.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Password is incorrect!");
  }

  const { refreshTokenClub, accessTokenClub } =
    await generateRefreshAccessTokenOrganizer(organizer._id);

  const loggedInOrganizer = await Club.findById(organizer._id).select(
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
    .cookie("accessToken", accessTokenClub, options)
    .cookie("refeshToken", refreshTokenClub, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInOrganizer,
          refreshTokenClub,
          accessTokenClub,
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

export {
  registerClub,
  registerParticipant,
  participantLogin,
  organizerLogin,
  logoutUser,
};
