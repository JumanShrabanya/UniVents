import { Router } from "express";
import {
  showEvents,
  createEvent,
  searchEvent,
  registerForEvent,
  showCategories,
} from "../controllers/event.controller.js";
import Authentication from "../middlewares/authentication.middleware.js";
import Authorization from "../middlewares/authorization.middleware.js";

const router = Router();

router.route("/events").get(showEvents);
router
  .route("/create-event")
  .post(Authentication, Authorization("organizer"), createEvent);
router.route("/").get(searchEvent); //http://localhost:8000/api/v1/event?search=coding
router
  .route("/events/events-register")
  .post(Authentication, Authorization("student"), registerForEvent);
router.route("/categories").get(Authentication, showCategories);
export default router;
