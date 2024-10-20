import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";

const registerEvent = asyncHandler(async (req, res) => {
  // get the student details from the middleware
  // check if its a student or not
  // get the event details that the student clicked on
  // check if the student is already registered

  const role = req.user.role;
  const userId = req.user._id;
  const { eventId } = req.body;

  // role checking
  if (role !== "student") {
    throw new ApiError(403, "Only students are allowed to register for events");
  }

  //   get the event
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "event does not exist!");
  }

  //   check if the student has already registered
  const isRegistered = await Registration.findOne({
    eventId: eventId,
    studentId: userId,
  });

  if (isRegistered) {
    throw new ApiError(400, "You have already registered for the event");
  }

  //   check if registration available
  if (!event.registrationAvailable) {
    throw new ApiError(400, "Registrations for this event are closed");
  }

  //   register the student
  const register = await Registration.create({
    studentId: userId,
    eventId: eventId,
  });

  res.status(200).json({ message: "Registration successfull" }, register);
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
