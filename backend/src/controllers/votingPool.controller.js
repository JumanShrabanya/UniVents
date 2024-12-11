import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VotingPool } from "../models/votingPool.model.js";
import { Club } from "../models/club.model.js";
import cron from "node-cron";

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

// Function to update the status of polls
const updateVotingPoolStatus = async () => {
  try {
    const currentDateTime = new Date();

    // Find all active polls where the end time has passed
    const pollsToUpdate = await VotingPool.find({
      isActive: true,
      $or: [{ endDate: { $lte: currentDateTime } }],
    });

    if (pollsToUpdate.length > 0) {
      const idsToUpdate = pollsToUpdate.map((poll) => poll._id);

      // Update the `isActive` status for these polls
      await VotingPool.updateMany(
        { _id: { $in: idsToUpdate } },
        { $set: { isActive: false } }
      );

      console.log(
        `Updated ${idsToUpdate.length} polls to inactive as their end time has passed.`
      );
    }
  } catch (error) {
    console.error("Error updating voting pool statuses:", error.message);
  }
};

// to show the results
const showResults = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Find the voting poll by its ID
  const poll = await VotingPool.findById(id);

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  // Check if the poll is still active
  if (poll.isActive) {
    return res.status(400).json({
      success: false,
      message: "Poll is still active. Results cannot be calculated yet.",
    });
  }

  // Find the winner based on optionCounters
  const optionCounters = poll.optionCounters;
  if (!optionCounters || optionCounters.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No votes recorded for this poll.",
    });
  }

  let winner = null;
  let maxVotes = 0;

  optionCounters.forEach((counter) => {
    if (counter.count > maxVotes) {
      maxVotes = counter.count;
      winner = counter.option;
    }
  });

  // Handle the case where no votes were cast
  if (!winner) {
    return res.status(200).json({
      success: true,
      message: "No winner, no votes were cast in this poll.",
    });
  }

  // Send the winner and results to the frontend
  res.status(200).json({
    success: true,
    winner,
    votes: maxVotes,
    message: `The winning option is '${winner}' with ${maxVotes} votes.`,
  });
});

// Schedule the cron job to run every 10 minutes
cron.schedule("*/10 * * * *", () => {
  console.log("Checking for expired voting polls...");
  updateVotingPoolStatus();
});

export { createVotingPool, showPools, castVote, showResults };
