import { Router } from "express";
import { chatHandler } from "../controllers/chat.controllers.js";

const router = Router();

router.route("/").post(chatHandler);

export default router;
