import express from 'express';
import {
  getStudentAIAnalysis,
  getStudentAIRecommendations,
  getStudentAIReport,
  getTeacherAIClassInsights,
  getAdminAIInsights
} from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication token checks globally across all AI queries
router.use(authenticateToken);

router.get('/student/:id/analysis', getStudentAIAnalysis);
router.get('/student/:id/recommendations', getStudentAIRecommendations);
router.get('/student/:id/report', getStudentAIReport);
router.get('/teacher/:id/insights', getTeacherAIClassInsights);
router.get('/admin/insights', getAdminAIInsights);

export default router;
