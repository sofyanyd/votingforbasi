import { Router } from "express";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
router.get("/", getEvents);
router.post("/", requireAdmin, createEvent);
router.put("/:id", requireAdmin, updateEvent);
router.delete("/:id", requireAdmin, deleteEvent);
export default router;
