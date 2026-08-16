import jwt from 'jsonwebtoken';
import { User, Student, Teacher, Admin } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'edupulse_secret_key_change_in_production';

/**
 * Middleware to authenticate JWT tokens.
 * Extracts token from authorization header, verifies it, and attaches the user to the request.
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user information to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      studentId: decoded.studentId, // Student table primary key id (if student)
      teacherId: decoded.teacherId, // Teacher table primary key id (if teacher)
      adminId: decoded.adminId      // Admin table primary key id (if admin)
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token has expired. Please log in again.' });
    }
    return res.status(403).json({ error: 'Invalid or corrupted access token.' });
  }
};

/**
 * Middleware to restrict access to specific roles.
 * Must be placed AFTER authenticateToken middleware.
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access Denied. Role '${req.user.role}' is not authorized to access this resource.` 
      });
    }

    next();
  };
};

/**
 * Helper function to generate a JWT token for a user.
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
