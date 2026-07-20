import { healthCheck } from "../controllers/health.controllers.js";
import express, { Router } from "express";

const router = Router();

router.route("/health").get(healthCheck);

export default router;
