import express from "express";
import {
  generateMonthlyReport,
  getMyReports,
} from "../controllers/reportController.js";
import protect from "../middlewares/auth.js";
import requireActivePremium from "../middlewares/premium.js";

const router = express.Router();

router.use(protect, requireActivePremium);

router.post("/generate", generateMonthlyReport);
router.get("/", getMyReports);

export default router;
