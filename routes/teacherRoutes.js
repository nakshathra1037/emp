import express from 'express';
import {
  getTeacherDashboard,
  getTeacherCourses,
  getTeacherClasses,
  getTeacherStudents,
  recordAttendance,
  updateAttendance,
  createAssignment,
  updateAssignment,
  evaluateSubmission,
  createExamination,
  enterExamMarks,
  getTeacherAIInsights
} from '../controllers/teacherController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateBody, validateAttendance, validateAssignment, validateExamMarks } from '../middleware/validation.js';

const router = express.Router();

// Apply auth middleware and restrict exclusively to teachers
router.use(authenticateToken);
router.use(authorizeRoles('teacher'));

router.get('/dashboard', getTeacherDashboard);
router.get('/courses', getTeacherCourses);
router.get('/classes', getTeacherClasses);
router.get('/students', getTeacherStudents);
router.get('/ai-insights', getTeacherAIInsights);

// Attendance routes
router.post('/attendance', validateBody(validateAttendance), recordAttendance);
router.put('/attendance/:id', updateAttendance);

// Assignment routes
router.post('/assignments', validateBody(validateAssignment), createAssignment);
router.put('/assignments/:id', updateAssignment);
router.post('/submissions/:id/evaluate', evaluateSubmission); // Grading submission

// Examinations routes
router.post('/exams', createExamination);
router.post('/marks', validateBody(validateExamMarks), enterExamMarks);

export default router;
