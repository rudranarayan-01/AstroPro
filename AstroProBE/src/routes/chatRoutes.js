import express from "express";
import { getChatHistory } from "../controllers/chatController.js";
import {  protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/chat/history", protect, getChatHistory);

export default router;