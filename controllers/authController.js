import bcrypt from 'bcryptjs';
import { User, Student, Teacher, Admin } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';
import { logActivity } from '../utils/activityLogger.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Retrieve role-specific primary key references
    let studentId = null;
    let teacherId = null;
    let adminId = null;
    let name = '';

    if (user.role === 'student') {
      const student = await Student.findOne({ where: { userId: user.id } });
      if (student) {
        studentId = student.id;
        name = `${student.firstName} ${student.lastName}`;
      }
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      if (teacher) {
        teacherId = teacher.id;
        name = `${teacher.firstName} ${teacher.lastName}`;
      }
    } else if (user.role === 'admin') {
      const admin = await Admin.findOne({ where: { userId: user.id } });
      if (admin) {
        adminId = admin.id;
        name = `${admin.firstName} ${admin.lastName}`;
      }
    }

    // Generate JWT token with full payload
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      studentId,
      teacherId,
      adminId
    });

    // Audit Log
    await logActivity(user.id, 'USER_LOGIN', `User ${email} successfully logged in as ${user.role}.`);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name,
        studentId,
        teacherId,
        adminId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user) {
      await logActivity(req.user.id, 'USER_LOGOUT', `User ${req.user.email} logged out.`);
    }
    return res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error during logout.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    let profileDetails = null;

    if (user.role === 'student') {
      profileDetails = await Student.findOne({ where: { userId: user.id } });
    } else if (user.role === 'teacher') {
      profileDetails = await Teacher.findOne({ where: { userId: user.id } });
    } else if (user.role === 'admin') {
      profileDetails = await Admin.findOne({ where: { userId: user.id } });
    }

    return res.status(200).json({
      user,
      profile: profileDetails
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal server error retrieving user profile.' });
  }
};
