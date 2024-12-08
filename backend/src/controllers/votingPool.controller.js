import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VotingPool } from "../models/votingPool.model.js";

const createVotingPool = asyncHandler(async (req, res) => {
  //get the voting dscription
  //make the entry in the db

  const { poolValues } = req.body;

  console.log(poolValues);
  if (
    !poolValues.title ||
    !poolValues.description ||
    !poolValues.options ||
    !poolValues.endDate ||
    !poolValues.availableFor
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  let endTime = "";
  if (poolValues.endTime) {
    const timeInput = "10:30 AM"; // Example time input
    const today = new Date();
    const [hours, minutes] = timeInput
      .split(/[: ]/) // Split into hours, minutes, AM/PM
      .map((value) => (isNaN(value) ? value : parseInt(value))); // Convert to integers
    const isPM = timeInput.includes("PM");

    // Create a date object with the specified time
    endTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      isPM ? hours + 12 : hours,
      minutes
    );
  }
  const optionCounters = poolValues.options.map((option) => ({
    option,
    count: 0,
  }));

  const votingPool = await VotingPool.create({
    title: poolValues.title,
    description: poolValues.description,
    options: poolValues.options,
    optionCounters: poolValues.optionCounters,
    endDate: poolValues.endDate,
    availableFor: poolValues.availableFor,
    endTime: endTime || "",
  });

  res.status(201).json({
    success: true,
    message: "Voting pool created successfully",
    votingPool,
  });
});

export { createVotingPool };
