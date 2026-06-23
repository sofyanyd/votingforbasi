import { Router } from "express";
import { getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker, } from "../controllers/speakerController.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
router.get("/", getSpeakers);
router.post("/", requireAdmin, createSpeaker);
router.put("/:id", requireAdmin, updateSpeaker);
router.delete("/:id", requireAdmin, deleteSpeaker);
export default router;
