import { Router } from "express";
import {
  showEvents,
  createEvent,
  searchEvent,
  registerForEvent,
  showCategories,
  checkRegistration,
} from "../controllers/event.controller.js";
import Authentication from "../middlewares/Authentication.middleware.js";
import Authorization from "../middlewares/Authorization.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/events").get(showEvents);
router
  .route("/create-event")
  .post(
    Authentication,
    Authorization("organizer"),
    upload.single("coverImg"),
    createEvent
  );
router.route("/").get(searchEvent);
router.route("/check-registration").post(checkRegistration);
router
  .route("/events-register")
  .post(Authentication, Authorization("student"), registerForEvent);
router.route("/categories").get(Authentication, showCategories);
export default router;
