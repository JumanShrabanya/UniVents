import { Router } from "express";
import {
  showRegisteredParticipants,
  editEventDetails,
  showCreatedEvents,
  addWinners,
  registeredParticipants,
} from "../controllers/organizer.controller.js";
import Authorization from "../middlewares/authorization.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/event-details/:eventId")
  .get(verifyJwt, Authorization("organizer"), showRegisteredParticipants);
router
  .route("/update-event/:eventId")
  .patch(verifyJwt, Authorization("organizer"), editEventDetails);
router
  .route("/created-events")
  .get(verifyJwt, Authorization("organizer"), showCreatedEvents);
router
  .route("/add-winners")
  .post(verifyJwt, Authorization("organizer"), addWinners);
router
  .route("/get-registered-participants")
  .post(verifyJwt, Authorization("organizer"), registeredParticipants);

export default router;
