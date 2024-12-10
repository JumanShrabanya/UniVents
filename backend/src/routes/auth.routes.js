import express from "express";
import { verifyEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/verify-email/:token", verifyEmail); // Email verification route

export default router;
