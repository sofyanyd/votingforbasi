import { Router } from "express";
import { 
  getLeaderboard, 
  getTransactions, 
  submitVotes,
  requestPayment,
  finalizePayment,
  midtransWebhook
} from "../controllers/voteController.js";

import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/leaderboard", getLeaderboard);
router.get("/transactions", requireAdmin, getTransactions);
router.post("/submit", submitVotes);
router.post("/request-payment", requestPayment);
router.post("/finalize-payment", finalizePayment);
router.post("/notification", midtransWebhook);

export default router;
