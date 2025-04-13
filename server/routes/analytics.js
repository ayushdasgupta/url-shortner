import express from 'express'
const router = express.Router();
import {getDashboardAnalytics} from '../controllers/analyticsController.js'
import {protect} from '../middleware/auth.js'

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);

export default router;