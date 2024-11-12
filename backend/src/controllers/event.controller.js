import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";
import { Club } from "../models/club.model.js";
import { Category } from "../models/category.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { Registration } from "../models/registration.model.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const showEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });

  if (!events || events.length === 0) {
    throw new ApiError(404, "No events found");
  }
  res.status(200).json(new ApiResponse(201, events));
});

// to handle the creation of a event
const createEvent = asyncHandler(async (req, res) => {
  // Validate token
  const token = req.cookies.accessToken;
  if (!token) {
    throw new ApiError(401, "No token provided. Authorization denied.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid token provided. Authorization denied.");
  }

  const organizerId = decoded._id;

  const isOrganizer = await Club.findById(organizerId);
  if (isOrganizer.role !== "organizer") {
    throw new ApiError(400, "Not an organizer! Access denied.");
  }

  // Destructure request body
  const { title, description, eventDate, venue, category } = req.body;

  // Validate required fields
  if (!title || !description || !eventDate || !venue || !category) {
    throw new ApiError(400, "All fields are required.");
  }

  // Validate the category
  const allCategories = Category.getPredefinedCategories();
  if (!allCategories.includes(category)) {
    throw new ApiError(400, "Invalid category.");
  }

  // Fetch or create category
  let categoryDoc = await Category.findOne({ categoryTitle: category });
  if (!categoryDoc) {
    categoryDoc = await Category.create({ categoryTitle: category });
  }

  // Ensure a cover image is provided
  if (!req.file) {
    throw new ApiError(400, "Cover image is required!");
  }

  let coverImgUrl = "";

  try {
    // Upload to Cloudinary using the file buffer
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );
    coverImgUrl = result.secure_url;
  } catch (error) {
    throw new ApiError(500, "Failed to upload the cover image.");
  }

  // Create the event
  const newEvent = await Event.create({
    title,
    description,
    eventDate,
    venue,
    coverImg: coverImgUrl, // Store the Cloudinary image URL
    organizer: organizerId,
    category: categoryDoc._id,
  });

  // Send the response
  res
    .status(201)
    .json(new ApiResponse(201, newEvent, "Event created successfully"));
});

// to handle event by search query
const searchEvent = asyncHandler(async (req, res) => {
  // get the query params
  // check if matching event available or not
  // if available, then showcase it
  // if not then show nothing

  const { search } = req.query;
  if (!search) {
    throw new ApiError(404, "Search query is required");
  }

  const matchingEvents = await Event.find({
    $and: [
      { title: { $regex: search, $options: "i" } },
      { registrationAvailable: true },
    ],
  });

  if (matchingEvents.length === 0) {
    throw new ApiError(404, "No events found");
  }

  res.status(200).json(new ApiResponse("Found events: ", matchingEvents));
});

// to register for an event
const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId, studentId } = req.body;
  if (!eventId || !studentId) {
    throw new ApiError(404, "Please provide the student id and event id");
  }

  // Check if the student has already registered for the specific event
  const alreadyRegistered = await Registration.findOne({ studentId, eventId });

  if (alreadyRegistered) {
    return res.status(400).json({
      statusCode: 400,
      message: "Already registered",
      success: false,
      errors: [],
    });
  }

  // Register the student for the event
  const registerEvent = await Registration.create({ studentId, eventId });

  if (!registerEvent) {
    throw new ApiError(500, "Something went wrong during registration");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { registerEvent }, "Registered successfully"));
});

// to check if the user registered for that event or not
const checkRegistration = asyncHandler(async (req, res) => {
  const { studentId, eventId } = req.body;

  // check
  const isRegistered = await Registration.findOne({ eventId, studentId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { registered: !!isRegistered },
        isRegistered ? "already registered" : "not registered"
      )
    );
});
// show categories
const showCategories = asyncHandler(async (req, res) => {
  // get the categories
  let categories = await Category.find({}, "categoryTitle");
  if (categories) {
    res.status(200).json(new ApiResponse("Categories: ", categories));
  } else {
    res.status(404).json(new ApiError("No categories found!"));
  }
});
export {
  showEvents,
  createEvent,
  searchEvent,
  registerForEvent,
  showCategories,
  checkRegistration,
};
