import { Router } from "express";
import Authentication from "../middlewares/authentication.middleware.js";
import Authorization from "../middlewares/authorization.middleware.js";
import {
  registerEvent,
  registeredEvents,
} from "../controllers/student.controller.js";

const router = Router();

router
  .route("/register-event")
  .post(Authentication, Authorization("student"), registerEvent);

router
  .route("/registered-events")
  .get(Authentication, Authorization("student"), registeredEvents);

export default router;
