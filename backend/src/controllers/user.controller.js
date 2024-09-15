import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js";

// for the participant
const registerParticipant = asyncHandler(async (req, res) => {
  // take the details provided by the user
  const [name, email, password, college, semister, rollno] = req.body;

  // verify the details
  if (
    [name, email, password, college, semister, rollno].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "please enter all the required credentials");
  }
  // validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.text(email)) {
    throw new ApiError(400, "Please provide a valid emial");
  }

  // check if the email already exists or not
  const existedUser = Student.findOne({
    email,
  });
  if (existedUser) {
    throw new ApiError(400, "An email id already exists");
  }
  // create the participant object in db
  const student = await Student.create({
    name,
    email,
    password,
    college,
    semister,
    rollno,
  });
  // remove the password and refresh token from the response
  const createdStudent = await Student.findById(student._id).select(
    "-password"
  );
  // check id the user got created or not
  if (!createdStudent) {
    throw new ApiError(
      500,
      "Something went wrong while making the entry in the DB"
    );
  }
  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdStudent, "user registered successfully"));
});

// for the club
const registerClub = asyncHandler(async (req, res) => {
  // get the club details
  const [clubName, collegeName, email, password] = req.body;

  // validate the details
  if (
    [clubName, collegeName, email, password].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please provide all the required details");
  }
  // check if email already exist
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.text(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }
  // check if the email already exists or not
  const existedClub = await Club.findOne({
    email,
  });
  if (existedClub) {
    throw new ApiError(400, "Club already exists with this email");
  }
  // create the club entry in db
  const club = Club.create({
    clubName,
    collegeName,
    email,
    password,
  });

  // remove the password and jwt token from response
  const createdClub = await Club.findById(club._id).select("-password");
  // check for club creation
  if (!createdClub) {
    throw new ApiError(
      500,
      "Something went wrong while making the entry in DB"
    );
  }
  // return success response
  return res.status(200).json(200, createdClub, "Club created successfully");
});

export { registerClub, registerParticipant };
