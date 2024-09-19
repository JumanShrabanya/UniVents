import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import { Club } from "../models/club.model.js";

// for the participant
const registerParticipant = asyncHandler(async (req, res) => {
  // take the details provided by the user
  const { name, email, password, college, semister, rollno } = req.body;

  // verify the details
  console.log(req.body);

  if (
    [name, email, password, college, semister, rollno].some(
      (field) => !field || field.trim() === ""
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
    rollno,
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

// for the club
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

export { registerClub, registerParticipant };
