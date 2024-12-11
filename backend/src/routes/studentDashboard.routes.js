import { Router } from "express";
import Authentication from "../middlewares/Authentication.middleware.js";
import Authorization from "../middlewares/Authorization.middleware.js";
import {
  registerEvent,
  registeredEvents,
  isStudentRegistered,
} from "../controllers/student.controller.js";

const router = Router();

router
  .route("/register-event")
  .post(Authentication, Authorization("student"), registerEvent);

router.route("/registered-events").get(Authentication, registeredEvents);
router.route("/alreadyRegistered").post(isStudentRegistered);

export default router;
