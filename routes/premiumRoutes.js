import express from "express";
import {
  activatePremium,
  getPremiumContents,
  getContentById,
} from "../controllers/premiumController.js";
import protect from "../middlewares/auth.js";
import requireActivePremium from "../middlewares/premium.js";

const router = express.Router();

router.post("/activate", protect, activatePremium);
router.get("/contents", protect, requireActivePremium, getPremiumContents);
router.get("/contents/:id", protect, requireActivePremium, getContentById);

export default router;
