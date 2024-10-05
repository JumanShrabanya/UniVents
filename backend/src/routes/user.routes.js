import { Router } from "express";
import {
  registerClub,
  registerParticipant,
  participantLogin,
  organizerLogin,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register-club").post(registerClub);
router.route("/register-participant").post(
  upload.fields([
    {
      name: "logoImg",
      maxCount: 1,
    },
  ]),
  registerParticipant
);
router.route("/login-club").post(organizerLogin);
router.route("/login-participant").post(participantLogin);

export default router;
