import { Student, Enrollment, Course, Assignment, AssignmentSubmission, Attendance, Examination, ExamResult, AcademicRecord, Class, User } from '../models/index.js';
import { logActivity } from '../utils/activityLogger.js';

// Student Dashboard Summary
export const getStudentDashboard = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const student = await Student.findByPk(studentId, { include: [Class] });
    
    // Enrollments
    const enrollments = await Enrollment.findAll({
      where: { studentId, status: 'enrolled' },
      include: [Course]
    });
    const courseIds = enrollments.map(e => e.courseId);

    // Recent Grades
    const recentGrades = await ExamResult.findAll({
      where: { studentId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Examination, include: [Course] }]
    });

    // Upcoming Assignments (Due after now)
    const upcomingAssignments = await Assignment.findAll({
      where: { courseId: courseIds },
      order: [['dueDate', 'ASC']],
      limit: 5,
      include: [Course]
    });

    return res.status(200).json({
      student,
      enrolledCoursesCount: enrollments.length,
      courses: enrollments.map(e => e.Course),
      recentGrades: recentGrades.map(g => ({
        examName: g.Examination.name,
        courseName: g.Examination.Course.name,
        pointsObtained: g.pointsObtained,
        maxPoints: g.Examination.maxPoints,
        grade: g.grade,
        remarks: g.remarks
      })),
      upcomingAssignments
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    return res.status(500).json({ error: 'Internal server error loading dashboard.' });
  }
};

// Student Profile
export const getStudentProfile = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const student = await Student.findByPk(studentId, {
      include: [
        { model: User, attributes: ['email', 'role'] },
        Class
      ]
    });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    return res.status(200).json(student);
  } catch (error) {
    console.error('Student profile error:', error);
    return res.status(500).json({ error: 'Internal server error fetching profile.' });
  }
};

// Enrolled Courses List
export const getStudentCourses = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const enrollments = await Enrollment.findAll({
      where: { studentId, status: 'enrolled' },
      include: [Course]
    });
    return res.status(200).json(enrollments.map(e => e.Course));
  } catch (error) {
    console.error('Student courses error:', error);
    return res.status(500).json({ error: 'Internal server error loading courses.' });
  }
};

// Get all assignments for enrolled courses with student submission data
export const getStudentAssignments = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const enrollments = await Enrollment.findAll({
      where: { studentId, status: 'enrolled' }
    });
    const courseIds = enrollments.map(e => e.courseId);

    const assignments = await Assignment.findAll({
      where: { courseId: courseIds },
      include: [Course]
    });

    const result = [];
    for (const assignment of assignments) {
      const submission = await AssignmentSubmission.findOne({
        where: { studentId, assignmentId: assignment.id }
      });
      result.push({
        assignment,
        submission: submission || null
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Student assignments error:', error);
    return res.status(500).json({ error: 'Internal server error loading assignments.' });
  }
};

// Submit an assignment
export const submitAssignment = async (req, res) => {
  const studentId = req.user.studentId;
  const assignmentId = req.params.id;
  const { submissionText, submissionUrl } = req.body;

  try {
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: `Assignment with ID ${assignmentId} not found.` });
    }

    // Check enrollment in course
    const enrolled = await Enrollment.findOne({
      where: { studentId, courseId: assignment.courseId, status: 'enrolled' }
    });
    if (!enrolled) {
      return res.status(403).json({ error: 'You are not enrolled in the course for this assignment.' });
    }

    // Check if submission already exists
    let submission = await AssignmentSubmission.findOne({
      where: { studentId, assignmentId }
    });

    if (submission) {
      // Overwrite/update submission
      submission.submissionText = submissionText;
      submission.submissionUrl = submissionUrl;
      submission.submittedAt = new Date();
      submission.status = 'submitted';
      // Reset grade upon re-submission
      submission.pointsObtained = null;
      submission.feedback = null;
      submission.gradedBy = null;
      await submission.save();
      await logActivity(req.user.id, 'SUBMIT_ASSIGNMENT_UPDATE', `Updated submission for assignment ${assignmentId}`);
    } else {
      // Create new submission
      submission = await AssignmentSubmission.create({
        assignmentId,
        studentId,
        submissionText,
        submissionUrl,
        submittedAt: new Date(),
        status: 'submitted'
      });
      await logActivity(req.user.id, 'SUBMIT_ASSIGNMENT_NEW', `Created submission for assignment ${assignmentId}`);
    }

    return res.status(200).json({ message: 'Assignment submitted successfully.', submission });
  } catch (error) {
    console.error('Submit assignment error:', error);
    return res.status(500).json({ error: 'Internal server error recording submission.' });
  }
};

// View attendance history
export const getStudentAttendance = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const attendance = await Attendance.findAll({
      where: { studentId },
      include: [Course],
      order: [['date', 'DESC']]
    });
    return res.status(200).json(attendance);
  } catch (error) {
    console.error('Student attendance error:', error);
    return res.status(500).json({ error: 'Internal server error loading attendance.' });
  }
};

// View Examinations
export const getStudentExams = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const enrollments = await Enrollment.findAll({
      where: { studentId, status: 'enrolled' }
    });
    const courseIds = enrollments.map(e => e.courseId);

    const exams = await Examination.findAll({
      where: { courseId: courseIds },
      include: [Course],
      order: [['date', 'ASC']]
    });
    return res.status(200).json(exams);
  } catch (error) {
    console.error('Student exams error:', error);
    return res.status(500).json({ error: 'Internal server error loading examinations.' });
  }
};

// View Exam Results / Marks
export const getStudentResults = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const results = await ExamResult.findAll({
      where: { studentId },
      include: [{ model: Examination, include: [Course] }]
    });
    return res.status(200).json(results);
  } catch (error) {
    console.error('Student results error:', error);
    return res.status(500).json({ error: 'Internal server error loading exam marks.' });
  }
};

// Get academic record history (GPAs)
export const getStudentProgress = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const records = await AcademicRecord.findAll({
      where: { studentId },
      order: [['term', 'ASC']]
    });
    return res.status(200).json(records);
  } catch (error) {
    console.error('Student progress error:', error);
    return res.status(500).json({ error: 'Internal server error loading progress logs.' });
  }
};
