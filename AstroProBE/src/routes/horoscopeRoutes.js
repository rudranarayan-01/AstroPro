import express from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { 
    analyzeKundli, 
    analyzePalm, 
    analyzeVastu 
} from '../controllers/horoscopeController.js';

const router = express.Router();

// All horoscope features are protected and trackable
router.post('/kundli',analyzeKundli);
router.post('/vastu', protect, analyzeVastu);

// Palm reading requires a file upload
router.post('/palm-read', protect, upload.single('palm_image'), analyzePalm);

export default router;