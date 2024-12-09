import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VotingPool } from "../models/votingPool.model.js";
import { Club } from "../models/club.model.js";

const createVotingPool = asyncHandler(async (req, res) => {
  const { poolValues } = req.body;

  if (!poolValues) {
    throw new ApiError(400, "poolValues is required.");
  }

  const requiredFields = [
    "title",
    "description",
    "options",
    "endDate",
    "availableFor",
    "collegeName",
    "organizer",
  ];
  const missingFields = requiredFields.filter((field) => !poolValues[field]);
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing fields: ${missingFields.join(", ")}`);
  }

  let endTime = "";
  if (poolValues.endTime) {
    const [hours, minutes] = poolValues.endTime
      .split(/[: ]/)
      .map((value) => (isNaN(value) ? value : parseInt(value)));
    const isPM = poolValues.endTime.includes("PM");

    const today = new Date();
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

  const org = await Club.findOne({ clubName: poolValues.organizer });
  if (!org) {
    throw new ApiError(400, "Organizer not found.");
  }

  const votingPool = await VotingPool.create({
    title: poolValues.title,
    description: poolValues.description,
    options: poolValues.options,
    optionCounters: optionCounters,
    endDate: poolValues.endDate,
    availableFor: poolValues.availableFor,
    endTime: endTime || "",
    organizer: org._id,
    collegeName: poolValues.collegeName,
  });

  res.status(201).json({
    success: true,
    message: "Voting pool created successfully",
    votingPool,
  });
});

// get the pools
const showPools = asyncHandler(async (req, res) => {
  const pools = await VotingPool.find({})
    .populate({
      path: "organizer",
      select: "clubName",
    })
    .sort({ createdAt: -1 });

  if (!pools || pools.length === 0) {
    throw new ApiError(404, "No events found");
  }
  res.status(200).json(new ApiResponse(201, pools));
});

// cast vote
const castVote = asyncHandler(async (req, res) => {
  // get the value of the vote casted by the user and the poll details
  // get the user details
  // find that voting poll
  // increment the counter for that option in the option counter
  // send the success message

  const { option, pollTitle } = req.body;
  const student = req.user;

  if (!option) {
    throw new ApiError(400, "Please provide the option");
  }

  console.log("casted vote", option);
  console.log("voting poll title", pollTitle);

  const poll = await VotingPool.findOne({ title: pollTitle });

  if (!poll) {
    throw new ApiError(404, "Invalid poll details");
  }

  if (!poll.isActive) {
    throw new ApiError(400, "Voting is closed for this poll.");
  }

  // Find the option in the poll's optionCounters
  const selectedOption = poll.optionCounters.find(
    (opt) => opt.option === option
  );

  selectedOption.count += 1;

  poll.participants.push({
    studentId: student._id,
    selectedOption: option,
  });

  await poll.save();

  res.status(200).json({
    success: true,
    message: "Vote cast successfully.",
    poll,
  });
});

export { createVotingPool, showPools, castVote };
