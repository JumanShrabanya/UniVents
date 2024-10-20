import cron from "node-cron";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Registration } from "../models/registration.model.js";
import jwt from "jsonwebtoken";
import { Event } from "../models/event.model.js";

const showRegisteredParticipants = asyncHandler(async (req, res) => {
  // Ensure that the organizer requesting the list is the creator of the event.
  // get the registered participants list from the registration schema
  // if there is registration then we will show case the {name, college, rollno, semester} of the participants

  const { eventId } = req.params;

  const token = req.cookies.accessToken;
  if (!token) {
    throw new ApiError(401, "No token provided. Authorization denied.");
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const organizerId = decoded._id;
  //
  const event = await Event.findOne({ _id: eventId, organizer: organizerId });
  if (!event) {
    return res.status(404).json({
      message: "Event not found or you're not authorized to view participants.",
    });
  }

  const participants = await Registration.find({ eventId }).populate(
    "studentId",
    "name college rollno semester"
  );

  if (participants.length === 0) {
    return res.status(404).json({ message: "No participants registered yet." });
  }

  res.status(200).json(
    participants.map((p) => ({
      name: p.studentId.name,
      college: p.studentId.college,
      rollno: p.studentId.rollno,
      semester: p.studentId.semester,
    }))
  );
});

const editEventDetails = asyncHandler(async (req, res) => {
  // if the event date is passed, then they can not edit
  //  if not , then check if the event belongs to the organizer or not
  //  if so, then get the new updated fields
  //  if there is a change in the event, then update the new changes
  // if want to change the cover image change that as well
  const { eventId } = req.params;
  const token = req.cookies.accessToken;
  if (!token) {
    throw new ApiError(401, "No token provided. Authorization denied!");
  }
  let organizerId;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    organizerId = decoded._id;
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token. Authorization denied!" });
  }
  // details
  const { eventDate, coverImg, ...updatedFields } = req.body;

  // find the event
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: "No event found!" });
  }

  if (new Date(event.eventDate) < new Date()) {
    res
      .status(400)
      .json({ message: "Can not edit an event that has already occurred" });
  }

  // Check if the logged-in user is the organizer of the event
  const validOrganizer = await Event.findOne({
    _id: eventId,
    organizer: organizerId,
  });
  if (!validOrganizer) {
    return res
      .status(403)
      .json({ message: "You are not authorized to edit this event" });
  }

  // Update event details
  if (Object.keys(updatedFields).length > 0) {
    Object.keys(updatedFields).forEach((key) => {
      if (event[key] !== updatedFields[key]) {
        event[key] = updatedFields[key]; // Only update if the value has changed
      }
    });
  }
  // update cover image
  if (coverImg && coverImg !== event.coverImg) {
    event.coverImg = coverImg;
  }

  // Save updated event
  await event.save();
  return res.status(200).json({ message: "Event updated successfully", event });
});

const showCreatedEvents = asyncHandler(async (req, res) => {
  // get the organizer data from the cookies
  // fetch the events created the organizer

  const token = req.cookies.accessToken;
  if (!token) {
    throw new ApiError(401, "No token found! Authorization denied");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const organizerId = decoded._id;

  const createdEvents = await Event.find({ organizer: organizerId });

  if (createdEvents.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No events found for this organizer."));
  }

  res
    .status(200)
    .json(new ApiResponse(201, "all the created events:", createdEvents));
});
// Schedule the cron job to run every hour for checking the events available for registration or not
cron.schedule("0 * * * *", async (req, res) => {
  // fetch the events where the event date is still in past and registrationAvailable is set to TRUE
  // update the registrationAvailable to FALSE

  try {
    const currDate = new Date();

    const eventsToUpdate = await Event.updateMany(
      {
        eventDate: { $lt: currDate },
        registrationAvailable: true,
      },
      { $set: { registrationAvailable: false } }
    );
  } catch (error) {
    console.error("Error updating event registration status:", error);
  }
});
export { showRegisteredParticipants, editEventDetails, showCreatedEvents };
