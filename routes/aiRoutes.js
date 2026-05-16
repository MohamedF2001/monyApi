import { Router } from "express";
import { chat, getChatHistory } from "../controllers/aiController.js";
import verifyToken from "../middlewares/auth.js";

const router = Router();

router.use(verifyToken);

router.post("/chat", chat);
router.get("/history", getChatHistory);

export default router;
