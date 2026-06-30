import { Router } from "express";
import { getQrCodes, createQrCode, updateQrCode, deleteQrCode, } from "../controllers/qrController.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
router.get("/", getQrCodes);
router.post("/", requireAdmin, createQrCode);
router.put("/:id", requireAdmin, updateQrCode);
router.delete("/:id", requireAdmin, deleteQrCode);
export default router;
