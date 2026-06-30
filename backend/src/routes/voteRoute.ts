import { Router } from "express";
import { 
  getLeaderboard, 
  getTransactions, 
  submitVotes,
  requestPayment,
  finalizePayment,
  mootaWebhook,
  deleteTransaction
} from "../controllers/voteController.js";

import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/leaderboard", getLeaderboard);
router.get("/transactions", requireAdmin, getTransactions);
router.post("/submit", submitVotes);
router.post("/request-payment", requestPayment);
router.post("/finalize-payment", finalizePayment);
router.delete("/transactions/:code", requireAdmin, deleteTransaction);

// Endpoint baru untuk menangkap notifikasi uang masuk dari Moota
router.post("/moota-webhook", mootaWebhook);

export default router;