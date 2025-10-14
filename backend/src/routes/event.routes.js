import { Router } from "express";
import {
  showEvents,
  createEvent,
  searchEvent,
  registerForEvent,
  showCategories,
  checkRegistration,
  getEventById,
} from "../controllers/event.controller.js";
import Authentication from "../middlewares/Authentication.middleware.js";
import Authorization from "../middlewares/Authorization.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// Main events route - can handle both all events and search
router.route("/").get(showEvents);

// Specific search route (for backward compatibility)
router.route("/search").get(searchEvent);

router
  .route("/create-event")
  .post(
    Authentication,
    Authorization("organizer"),
    upload.single("coverImg"),
    createEvent
  );

router.route("/check-registration").post(checkRegistration);
router
  .route("/events-register")
  .post(Authentication, Authorization("student"), registerForEvent);
router.route("/categories").get(Authentication, showCategories);

// Get a single event by ID
router.route("/:eventId").get(getEventById);

export default router;
