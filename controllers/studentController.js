import { Student, Enrollment, Course, Assignment, AssignmentSubmission, Attendance, Examination, ExamResult, AcademicRecord, Class, User } from '../models/index.js';
import { logActivity } from '../utils/activityLogger.js';
import aiService from '../services/aiService.js';
import analyticsService from '../services/analyticsService.js';

// Student Dashboard Summary
export const getStudentDashboard = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const studentDb = await Student.findByPk(studentId, { include: [Class] });
    if (!studentDb) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    const stats = await analyticsService.getStudentAnalytics(studentId);
    const aiAnalysis = await aiService.getStudentAnalysis(studentId);

    // Compute dynamic CGPA (Scale overall performance health index to 4.0 GPA scale)
    const cgpa = parseFloat(((stats.academicSummary.academicHealth / 100) * 4.0).toFixed(2));

    const studentSchema = {
      id: studentDb.id,
      name: `${studentDb.firstName} ${studentDb.lastName}`,
      rollNo: studentDb.studentId,
      email: req.user.email,
      department: studentDb.Class ? studentDb.Class.name.replace('Class ', '') : 'Computer Science',
      semester: 5,
      cgpa: cgpa,
      weakSubject: stats.weakSubjects[0]?.subject || 'None',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 019-2834',
      guardianName: 'Arthur Stone',
      guardianPhone: '+1 (555) 019-5832',
      academicRisk: stats.riskLevel
    };

    // Fetch enrollments
    const enrollments = await Enrollment.findAll({
      where: { studentId, status: 'enrolled' },
      include: [Course]
    });
    const courseIds = enrollments.map(e => e.courseId);

    const coursesSchema = enrollments.map(e => ({
      id: e.Course.id,
      code: e.Course.code,
      name: e.Course.name,
      schedule: e.Course.scheduleInfo || 'Mon-Fri 9:00 AM - 1:00 PM'
    }));

    // Fetch assignments and check submission statuses
    const assignments = await Assignment.findAll({
      where: { courseId: courseIds },
      include: [Course]
    });

    const submissions = await AssignmentSubmission.findAll({
      where: { studentId }
    });

    const assignmentsSchema = assignments.map(a => {
      const sub = submissions.find(s => s.assignmentId === a.id);
      let status = 'Pending';
      let earnedPoints = null;
      if (sub) {
        status = sub.status === 'graded' ? 'Graded' : 'Submitted';
        earnedPoints = sub.score;
      }

      return {
        id: a.id,
        courseCode: a.Course.code,
        title: a.title,
        dueDate: a.dueDate,
        totalPoints: a.maxPoints,
        status,
        earnedPoints
      };
    });

    const aiSummarySchema = {
      overallPerformanceScore: Math.round(aiAnalysis.aiAnalysis.academicHealth || stats.academicSummary.academicHealth),
      metrics: {
        attendancePct: Math.round(stats.academicSummary.attendanceRate),
        assignmentAvg: Math.round(stats.academicSummary.assignmentScore),
        examAvg: Math.round(stats.academicSummary.examinationScore)
      },
      academicRiskLevel: aiAnalysis.aiAnalysis.riskLevel,
      riskColor: aiAnalysis.aiAnalysis.riskLevel === 'High' ? '#dc2626' : 
                 aiAnalysis.aiAnalysis.riskLevel === 'Medium' ? '#f59e0b' : '#10b981',
      weakSubjects: stats.weakSubjects.map(ws => ({
        reason: ws.reason
      }))
    };

    return res.status(200).json({
      student: studentSchema,
      courses: coursesSchema,
      assignments: assignmentsSchema,
      aiSummary: aiSummarySchema,
      enrolledCoursesCount: coursesSchema.length
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
