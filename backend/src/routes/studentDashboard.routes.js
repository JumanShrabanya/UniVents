import { Router } from "express";
import Authorization from "../middlewares/authorization.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  registerEvent,
  registeredEvents,
  isStudentRegistered,
} from "../controllers/student.controller.js";

const router = Router();

router
  .route("/register-event")
  .post(verifyJwt, Authorization("student"), registerEvent);

router.route("/registered-events").get(verifyJwt, registeredEvents);
router.route("/alreadyRegistered").post(isStudentRegistered);

export default router;
