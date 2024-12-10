import { Router } from "express";
import {
  createVotingPool,
  showPools,
  castVote,
  showResults,
} from "../controllers/votingPool.controller.js";
import Authentication from "../middlewares/Authentication.middleware.js";
import Authorization from "../middlewares/Authorization.middleware.js";

const router = Router();

router
  .route("/create-voting-pool")
  .post(Authentication, Authorization("organizer"), createVotingPool);
router.route("/show-pools").get(showPools);
router.route("/get-poll-results").post(showResults);
router.route("/cast-vote").post(Authentication, castVote);

export default router;
