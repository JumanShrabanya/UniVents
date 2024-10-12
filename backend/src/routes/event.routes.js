import { Router } from "express";
import { showEvents, createEvent } from "../controllers/event.controller.js";

const router = Router();

router.route("/events").post(showEvents);
router.route("/create-event").post(createEvent);

export default router;
