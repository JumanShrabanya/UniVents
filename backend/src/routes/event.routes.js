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
import Authorization from "../middlewares/Authorization.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

// Main events route - can handle both all events and search
router.route("/").get(showEvents);

// Specific search route (for backward compatibility)
router.route("/search").get(searchEvent);

router
  .route("/create-event")
  .post(
    verifyJwt,
    Authorization("organizer"),
    upload.single("coverImg"),
    createEvent
  );

router.route("/check-registration").post(checkRegistration);
router
  .route("/events-register")
  .post(verifyJwt, Authorization("student"), registerForEvent);
router.route("/categories").get(verifyJwt, showCategories);

// Get a single event by ID
router.route("/:eventId").get(getEventById);

export default router;
