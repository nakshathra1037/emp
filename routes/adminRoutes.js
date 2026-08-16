import express from 'express';
import {
  getAdminDashboard,
  getAdminStudents,
  getAdminTeachers,
  getAdminCourses,
  getAdminClasses,
  getAdminAnalytics,
  getAdminRisks,
  getAdminReports,
  getAdminActivity
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware and restrict exclusively to admins
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/students', getAdminStudents);
router.get('/teachers', getAdminTeachers);
router.get('/courses', getAdminCourses);
router.get('/classes', getAdminClasses);
router.get('/analytics', getAdminAnalytics);
router.get('/risks', getAdminRisks);
router.get('/reports', getAdminReports);
router.get('/activity', getAdminActivity);

export default router;
