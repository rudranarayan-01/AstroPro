import express from 'express';
import { protect } from '../middlewares/auth.js';
import { ClientAnalysisHistory } from '../controllers/analysisHistoryController.js';

const router = express.Router();

// Protect all routes in this file
router.get('/', protect, ClientAnalysisHistory);

export default router;