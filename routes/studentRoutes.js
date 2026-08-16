import express from 'express';
import {
  getStudentDashboard,
  getStudentProfile,
  getStudentCourses,
  getStudentAssignments,
  submitAssignment,
  getStudentAttendance,
  getStudentExams,
  getStudentResults,
  getStudentProgress
} from '../controllers/studentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware and restrict exclusively to students
router.use(authenticateToken);
router.use(authorizeRoles('student'));

router.get('/dashboard', getStudentDashboard);
router.get('/profile', getStudentProfile);
router.get('/courses', getStudentCourses);
router.get('/assignments', getStudentAssignments);
router.post('/assignments/:id/submit', submitAssignment);
router.get('/attendance', getStudentAttendance);
router.get('/exams', getStudentExams);
router.get('/results', getStudentResults);
router.get('/progress', getStudentProgress);

export default router;
