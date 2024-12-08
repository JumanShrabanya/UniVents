import cron from "node-cron";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Registration } from "../models/registration.model.js";
import jwt from "jsonwebtoken";
import { Event } from "../models/event.model.js";
import { Category } from "../models/category.model.js";

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

  const { updatedFields } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "No event found!" });
  }

  if (updatedFields.category) {
    const categoryTitle = updatedFields.category;
    let categoryDoc = await Category.findOne({ categoryTitle });

    if (!categoryDoc) {
      categoryDoc = await Category.create({ categoryTitle });
    }

    // Replace category title with the resolved category's ID
    updatedFields.category = categoryDoc._id;
  }

  if (new Date(event.eventDate) < new Date()) {
    return res.status(400).json({
      message: "Cannot edit an event that has already occurred",
    });
  }

  const validOrganizer = await Event.findOne({
    _id: eventId,
    organizer: organizerId,
  });

  if (!validOrganizer) {
    return res.status(403).json({
      message: "You are not authorized to edit this event",
    });
  }

  if (Object.keys(updatedFields).length > 0) {
    Object.assign(event, updatedFields);
  }

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

  const createdEvents = await Event.find({ organizer: organizerId })
    .populate({
      path: "organizer",
      select: "clubName",
    })
    .populate({
      path: "category",
      select: "categoryTitle",
    });

  if (createdEvents.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No events found for this organizer."));
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdEvents, "all the created events:"));
});

// to add winners in the db
const addWinners = asyncHandler(async (req, res) => {
  // get the event id
  // get the winner names from the font end
  // add the winners in the schema

  const { currentEventId, firstWinner, secondWinner, thirdWinner } = req.body;
  if (!currentEventId || !firstWinner || !secondWinner || !thirdWinner) {
    throw new ApiError(400, "All fields are required");
  }
  const event = await Event.findById(currentEventId);

  if (!event) {
    throw new ApiError(404, "No event found");
  }
  event.winners = [firstWinner, secondWinner, thirdWinner];
  await event.save();
  res.status(200).json({
    success: true,
    message: "Winners added successfully",
    data: event.winners,
  });
});
// Schedule the cron job to run for checking the events available for registration or not
cron.schedule("* * * * *", async () => {
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
export {
  showRegisteredParticipants,
  editEventDetails,
  showCreatedEvents,
  addWinners,
};
