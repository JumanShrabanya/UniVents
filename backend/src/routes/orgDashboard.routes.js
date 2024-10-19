import { Router } from "express";
import { showRegisteredParticipants } from "../controllers/organizer.controller";

const router = Router();

router.route("/event-details/:eventId").get(showRegisteredParticipants);

export default router;
