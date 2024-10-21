import { Router } from "express";
import {
  showRegisteredParticipants,
  editEventDetails,
  showCreatedEvents,
} from "../controllers/organizer.controller.js";
import Authentication from "../middlewares/Authentication.middleware.js";
import Authorization from "../middlewares/Authorization.middleware.js";

const router = Router();

router
  .route("/event-details/:eventId")
  .get(Authentication, Authorization("organizer"), showRegisteredParticipants);
router
  .route("/update-event/:eventId")
  .patch(Authentication, Authorization("organizer"), editEventDetails);
router
  .route("/created-events")
  .get(Authentication, Authorization("organizer"), showCreatedEvents);

export default router;
