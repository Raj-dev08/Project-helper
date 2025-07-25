import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken,createVideoCallSchedule } from "../controllers/videocall.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/schedule", protectRoute, createVideoCallSchedule);

export default router;