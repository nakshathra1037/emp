import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Public login route
router.post('/login', validateBody(validateLogin), login);

// Authenticated routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);

export default router;
