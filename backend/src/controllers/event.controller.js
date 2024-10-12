import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";

const showEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({});

  if (!events || events.length === 0) {
    throw new ApiError(401, "No events found");
  }
  res.status(200).json(new ApiResponse("Available events: ", events));
});

export { showEvents };
