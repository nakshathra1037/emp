import express from 'express';
import { listCourses, searchCourses, getCourseDetails, enrollInCourse } from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes for course browsing
router.get('/', listCourses);
router.get('/search', searchCourses);
router.get('/:id', getCourseDetails);

// Authenticated route for course enrollment (Self-enrollment or by admin/teacher)
router.post('/enroll', authenticateToken, enrollInCourse);

export default router;
