import { Router } from "express";
import {
  getSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "../controllers/speakerController.js";

const router = Router();

router.get("/", getSpeakers);
router.post("/", createSpeaker);
router.put("/:id", updateSpeaker);
router.delete("/:id", deleteSpeaker);

export default router;