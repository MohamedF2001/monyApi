import { Router } from "express";
import {
  getQuestions,
  calculateAndSaveProfile,
  saveMyProfile,
  getMyProfile,
} from "../controllers/financialProfileController.js";
import verifyToken from "../middlewares/auth.js";

const router = Router();

router.use(verifyToken);

router.get("/questions", getQuestions);
router.post("/calculate", calculateAndSaveProfile);
router.post("/", saveMyProfile);
router.get("/", getMyProfile);

export default router;
