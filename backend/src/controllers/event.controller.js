import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";
import { Category } from "../models/category.model.js";
import jwt from "jsonwebtoken";

const showEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({});

  if (!events || events.length === 0) {
    throw new ApiError(404, "No events found");
  }
  res.status(200).json(new ApiResponse(201, events));
});

// to handle the creation of a event
const createEvent = asyncHandler(async (req, res) => {
  // get the event details
  // get the club id from the cookies
  // check if the details are given or not
  // check if the category is predefined or not
  // make an entry of that event in the database

  const token = req.cookies.accessToken;
  if (!token) {
    throw new ApiError(401, "No token provided. Authorization denied.");
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const organizerId = decoded._id;

  const { title, description, eventDate, venue, category } = req.body;

  if (!title || !description || !eventDate || !venue || !category) {
    throw new ApiError(400, "All the fields are required");
  }
  const allCategories = Category.getPredefinedCategories();
  if (!allCategories.includes(category)) {
    throw new ApiError(400, "Invalid Category");
  }

  let categoryDoc = await Category.findOne({ categoryTitle: category });
  if (!categoryDoc) {
    categoryDoc = await Category.create({ categoryTitle: category });
  }
  const newEvent = await Event.create({
    title,
    description,
    eventDate,
    venue,
    organizer: organizerId,
    category: categoryDoc._id,
  });
  await newEvent.save();

  res.status(200).json(new ApiResponse("Event created Successfully", newEvent));
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
    title: { $regex: search, $options: "i" },
  });

  if (matchingEvents.length === 0) {
    throw new ApiError(404, "No events found");
  }

  res.status(200).json(new ApiResponse("Found events: ", matchingEvents));
});

export { showEvents, createEvent, searchEvent };
