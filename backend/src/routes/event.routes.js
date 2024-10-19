import { Router } from "express";
import {
  showEvents,
  createEvent,
  searchEvent,
  registerForEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.route("/events").get(showEvents);
router.route("/create-event").post(createEvent);
router.route("/").get(searchEvent); //http://localhost:8000/api/v1/event?search=coding
router.route("/events/evnts-register").post(registerForEvent);

export default router;
