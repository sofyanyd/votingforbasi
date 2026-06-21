import { Router } from "express";
import { 
  getLeaderboard, 
  getTransactions, 
  submitVotes,
  requestPayment,
  finalizePayment
} from "../controllers/voteController.js";

const router = Router();

router.get("/leaderboard", getLeaderboard);
router.get("/transactions", getTransactions);
router.post("/submit", submitVotes);
router.post("/request-payment", requestPayment);
router.post("/finalize-payment", finalizePayment);

export default router;
