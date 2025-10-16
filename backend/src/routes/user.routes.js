import { Router } from "express";
import {
  registerClub,
  registerParticipant,
  userLogin,
  logoutUser,
  refreshAcessTokenStudent,
  refreshAcessTokenOrganizer,
  viewProfile,
  updateProfile,
  checkAuthStatus,
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
router.route("/login").post(userLogin);
router.route("/profile").get(verifyJwt, viewProfile);
router.route("/update-profile").patch(verifyJwt, updateProfile);
router.route("/check-auth-status").get(verifyJwt, checkAuthStatus);
// router.route("/check-auth-status").get((req, res) => {
// res.json({ role: "student" });
// });

// secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token-student").post(refreshAcessTokenStudent);
router.route("/refresh-token-organizer").post(refreshAcessTokenOrganizer);
export default router;
