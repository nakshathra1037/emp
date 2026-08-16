import { Course, Teacher, Enrollment, Student, Class } from '../models/index.js';
import { Op } from 'sequelize';
import { logActivity } from '../utils/activityLogger.js';

// Get list of courses (supports simple teacher filter)
export const listCourses = async (req, res) => {
  const { teacherId } = req.query;
  const where = {};
  if (teacherId) {
    where.teacherId = teacherId;
  }

  try {
    const courses = await Course.findAll({
      where,
      include: [{ model: Teacher, attributes: ['id', 'firstName', 'lastName', 'employeeId'] }]
    });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('List courses error:', error);
    return res.status(500).json({ error: 'Internal server error listing courses.' });
  }
};

// Search and filter courses
export const searchCourses = async (req, res) => {
  const { q } = req.query; // search query parameter

  if (!q) {
    return res.status(400).json({ error: 'Search query parameter q is required.' });
  }

  try {
    const courses = await Course.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { code: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [{ model: Teacher, attributes: ['id', 'firstName', 'lastName'] }]
    });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Search courses error:', error);
    return res.status(500).json({ error: 'Internal server error searching courses.' });
  }
};

// Get single course details
export const getCourseDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id, {
      include: [
        { model: Teacher, attributes: ['id', 'firstName', 'lastName', 'employeeId'] }
      ]
    });

    if (!course) {
      return res.status(404).json({ error: `Course with ID ${id} not found.` });
    }

    // Schedule information can be derived from the database class mapping
    // We will retrieve classrooms that teach this course.
    const classes = await Class.findAll({
      include: [{
        model: Student,
        include: [{
          model: Enrollment,
          where: { courseId: id }
        }]
      }]
    });

    return res.status(200).json({
      course,
      classes: classes.map(c => ({
        id: c.id,
        name: c.name,
        scheduleInfo: c.scheduleInfo,
        room: c.room
      }))
    });
  } catch (error) {
    console.error('Get course details error:', error);
    return res.status(500).json({ error: 'Internal server error fetching course details.' });
  }
};

// Enroll student in a course
export const enrollInCourse = async (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({ error: 'studentId and courseId are required parameters.' });
  }

  // Security Check: If user is a student, ensure they can only enroll themselves
  if (req.user.role === 'student' && req.user.studentId !== parseInt(studentId)) {
    return res.status(403).json({ error: 'Access Denied. Students can only enroll themselves.' });
  }

  try {
    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: `Course with ID ${courseId} not found.` });
    }

    // Verify student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: `Student with ID ${studentId} not found.` });
    }

    // Check if enrollment already exists
    const existing = await Enrollment.findOne({ where: { studentId, courseId } });
    if (existing) {
      if (existing.status === 'dropped') {
        // Re-enroll
        existing.status = 'enrolled';
        await existing.save();
        await logActivity(req.user.id, 'STUDENT_REENROLL', `Re-enrolled student ${studentId} in course ${courseId}`);
        return res.status(200).json({ message: 'Re-enrolled in course successfully.', enrollment: existing });
      }
      return res.status(400).json({ error: 'Student is already enrolled in this course.' });
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      status: 'enrolled'
    });

    await logActivity(req.user.id, 'STUDENT_ENROLL', `Enrolled student ${studentId} in course ${courseId}`);
    return res.status(201).json({ message: 'Enrollment successful.', enrollment });
  } catch (error) {
    console.error('Enroll course error:', error);
    return res.status(500).json({ error: 'Internal server error processing enrollment.' });
  }
};
