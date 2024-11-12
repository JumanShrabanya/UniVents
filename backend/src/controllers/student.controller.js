import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";

const registerEvent = asyncHandler(async (req, res) => {
  // Get the student details from the middleware
  const role = req.user.role;
  const userId = req.user._id;
  const { eventId } = req.body;

  // Role check
  if (role !== "student") {
    throw new ApiError(403, "Only students are allowed to register for events");
  }

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event does not exist!");
  }

  // Check if the student is already registered
  const isRegistered = await Registration.findOne({
    eventId,
    studentId: userId,
  });
  if (isRegistered) {
    throw new ApiError(400, "You have already registered for the event");
  }

  // Check if registration is available
  if (!event.registrationAvailable) {
    throw new ApiError(400, "Registrations for this event are closed");
  }

  // Register the student
  const register = await Registration.create({
    studentId: userId,
    eventId,
  });

  return res.status(201).json({
    statusCode: 201,
    message: "Registration successful",
    data: register,
  });
});

// to showcase all the registered events by the student
const registeredEvents = asyncHandler(async (req, res) => {
  // get the user details
  // check if the role is student or not
  // fetch all the events with the student id

  const userId = req.user._id;
  const role = req.user.role;

  if (role !== "student") {
    throw new ApiError(403, "Access denied");
  }

  const registrations = await Registration.find({ studentId: userId }).populate(
    "eventId"
  );

  if (registrations.length === 0) {
    throw new ApiError(404, "No events found!");
  }
  res
    .status(200)
    .json({ message: "Registered events by the student: " }, registrations);
});
export { registerEvent, registeredEvents };
