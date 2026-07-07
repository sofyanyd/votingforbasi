import { Router } from "express";
import { getLeaderboard, getTransactions, submitVotes, requestPayment, finalizePayment, deleteTransaction, submitOfflineVotes } from "../controllers/voteController.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
router.get("/leaderboard", getLeaderboard);
router.get("/transactions", requireAdmin, getTransactions);
router.post("/submit", submitVotes);
router.post("/request-payment", requestPayment);
router.post("/finalize-payment", finalizePayment);
router.post("/submit-offline", requireAdmin, submitOfflineVotes);
router.delete("/transactions/:code", requireAdmin, deleteTransaction);
// Endpoint untuk menangkap notifikasi Moota dinonaktifkan demi keamanan karena beralih ke alur persetujuan manual (ACC) admin
// router.post("/moota-webhook", mootaWebhook);
export default router;
