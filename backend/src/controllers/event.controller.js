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
import { Student } from "../models/student.model.js";
import mongoose from "mongoose";

// to show the events
const showEvents = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  // Convert page and limit to numbers and validate
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;

  // Ensure reasonable limits
  const maxLimit = 50; // Maximum 50 events per request
  const actualLimit = Math.min(limitNumber, maxLimit);
  const skip = (pageNumber - 1) * actualLimit;

  let events;
  let totalEvents = 0;

  try {
    if (search && search.trim()) {
      // If search query is provided, search across multiple fields
      const searchQuery = {
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { description: { $regex: search.trim(), $options: "i" } },
          { collegeName: { $regex: search.trim(), $options: "i" } },
        ],
      };

      // Get total count for pagination
      totalEvents = await Event.countDocuments(searchQuery);

      // Get paginated results
      events = await Event.find(searchQuery)
        .populate({
          path: "organizer",
          select: "clubName collegeName",
        })
        .populate({
          path: "category",
          select: "categoryTitle",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(actualLimit);
    } else {
      // If no search query, return all events with pagination
      totalEvents = await Event.countDocuments({});

      events = await Event.find({})
        .populate({
          path: "organizer",
          select: "clubName collegeName",
        })
        .populate({
          path: "category",
          select: "categoryTitle",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(actualLimit);
    }

    // Return empty array if no events found (don't throw error)
    if (!events) {
      events = [];
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalEvents / actualLimit);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    const response = {
      events,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalEvents,
        eventsPerPage: actualLimit,
        hasNextPage,
        hasPrevPage,
      },
    };

    res
      .status(200)
      .json(new ApiResponse(200, response, "Events retrieved successfully"));
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json(new ApiResponse(500, [], "Error fetching events"));
  }
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
  const {
    title,
    description,
    eventDate,
    venue,
    category,
    availableSeats,
    availableFor,
    collegeName,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !eventDate ||
    !venue ||
    !category ||
    !availableSeats ||
    !availableFor ||
    !collegeName
  ) {
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
    availableFor,
    availableSeats,
    coverImg: coverImgUrl, // Store the Cloudinary image URL
    organizer: organizerId,
    category: categoryDoc._id,
    collegeName,
  });

  // Send the response
  res
    .status(201)
    .json(new ApiResponse(201, newEvent, "Event created successfully"));
});

// to handle event by search query (keeping for backward compatibility)
const searchEvent = asyncHandler(async (req, res) => {
  // Get the query params
  const { search, page = 1, limit = 10 } = req.query;

  if (!search || !search.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  // Convert page and limit to numbers and validate
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;

  // Ensure reasonable limits
  const maxLimit = 50; // Maximum 50 events per request
  const actualLimit = Math.min(limitNumber, maxLimit);
  const skip = (pageNumber - 1) * actualLimit;

  try {
    // Query to search across title, description, and collegeName
    const searchQuery = {
      $or: [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { collegeName: { $regex: search.trim(), $options: "i" } },
      ],
    };

    // Get total count for pagination
    const totalEvents = await Event.countDocuments(searchQuery);

    if (totalEvents === 0) {
      throw new ApiError(404, "No events found");
    }

    // Get paginated results
    const matchingEvents = await Event.find(searchQuery)
      .populate({
        path: "organizer",
        select: "clubName collegeName",
      })
      .populate({
        path: "category",
        select: "categoryTitle",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(actualLimit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalEvents / actualLimit);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    const response = {
      events: matchingEvents,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalEvents,
        eventsPerPage: actualLimit,
        hasNextPage,
        hasPrevPage,
      },
    };

    res
      .status(200)
      .json(new ApiResponse(200, response, "Events found successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error searching events:", error);
    res.status(500).json(new ApiResponse(500, [], "Error searching events"));
  }
});

// to register for an event
const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId, studentId } = req.body;

  if (!eventId || !studentId) {
    throw new ApiError(400, "Please provide the student ID and event ID.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get the event document
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new ApiError(404, "Event not found.");
    }

    // Get the student document
    const participant = await Student.findById(studentId).session(session);
    if (!participant) {
      throw new ApiError(404, "Student not found.");
    }

    // Check eligibility
    if (
      event.availableFor === "College only" &&
      participant.collegeName !== event.collegeName
    ) {
      throw new ApiError(403, "Student is not from the same college.");
    }

    // Check if registrations are open
    if (!event.registrationAvailable) {
      throw new ApiError(400, "Registrations for this event are closed.");
    }

    // Check available seats
    if (event.counterSeats >= event.availableSeats) {
      throw new ApiError(409, "No available seats left for this event.");
    }

    // Check if the student is already registered
    const alreadyRegistered = await Registration.findOne({
      studentId,
      eventId,
    }).session(session);
    if (alreadyRegistered) {
      throw new ApiError(400, "Already registered for this event.");
    }

    // Register the student
    const registerEvent = await Registration.create([{ studentId, eventId }], {
      session,
    });
    if (!registerEvent) {
      throw new ApiError(500, "Failed to register for the event.");
    }

    // Increment the counterSeats
    event.counterSeats += 1;
    await event.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(new ApiResponse(201, { registerEvent }, "Registered successfully"));
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// to check if the user registered for that event or not
const checkRegistration = asyncHandler(async (req, res) => {
  const { eventId, studentId } = req.body;

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
