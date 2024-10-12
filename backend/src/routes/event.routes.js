import { Router } from "express";
import { showEvents } from "../controllers/event.controller.js";

const router = Router();

router.route("/events").post(showEvents);

export default router;
