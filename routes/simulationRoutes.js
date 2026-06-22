import express from "express";
import {
  createSimulation,
  getMySimulations,
  deleteSimulation,
} from "../controllers/simulationController.js";
import protect from "../middlewares/auth.js";
import requireActivePremium from "../middlewares/premium.js";

const router = express.Router();

router.use(protect, requireActivePremium);

router.post("/", createSimulation);
router.get("/", getMySimulations);
router.delete("/:id", deleteSimulation);

export default router;
