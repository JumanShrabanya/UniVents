import { Router } from "express";
import { createVotingPool } from "../controllers/votingPool.controller.js";
import Authentication from "../middlewares/Authentication.middleware.js";
import Authorization from "../middlewares/Authorization.middleware.js";

const router = Router();

router
  .route("/create-voting-pool")
  .post(Authentication, Authorization("organizer"), createVotingPool);

export default router;
