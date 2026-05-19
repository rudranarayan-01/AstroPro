import express from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { 
    analyzeKundli, 
    analyzePalm, 
    analyzeVastu 
} from '../controllers/horoscopeController.js';
import { getPublicAnalysis } from '../controllers/publicAstrologyController.js';

const router = express.Router();

// All horoscope features are protected and trackable
router.post('/kundli',protect, analyzeKundli);
router.post('/vastu', protect, analyzeVastu);
router.post('/calculate-public', protect, getPublicAnalysis);

// Palm reading requires a file upload
router.post('/palm-read', protect, upload.single('palm_image'), analyzePalm);

export default router;