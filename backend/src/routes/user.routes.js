import { Router } from "express";
import {
  registerClub,
  registerParticipant,
  participantLogin,
  organizerLogin,
  logoutUser,
  refreshAcessTokenStudent,
  refreshAcessTokenOrganizer,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

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

// secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token-student").post(refreshAcessTokenStudent);
router.route("/refresh-token-organizer").post(refreshAcessTokenOrganizer);
export default router;
