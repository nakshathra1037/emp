import { Student, Teacher, Course, Class, User, ActivityLog } from '../models/index.js';
import analyticsService from '../services/analyticsService.js';
import reportService from '../services/reportService.js';
import { logActivity } from '../utils/activityLogger.js';

// Admin dashboard overview
export const getAdminDashboard = async (req, res) => {
  try {
    const studentCount = await Student.count();
    const teacherCount = await Teacher.count();
    const courseCount = await Course.count();
    const classCount = await Class.count();

    const stats = await analyticsService.getGlobalAnalytics();

    // Calculate department performance dynamically
    const mathAvg = await analyticsService.getCourseAveragePerformance(1); // MATH101
    const csAvg = await analyticsService.getCourseAveragePerformance(2); // CS101
    const sciAvg = await analyticsService.getCourseAveragePerformance(3); // SCI102

    const departmentPerformance = [
      { department: 'Computer Science', avgScore: parseFloat((csAvg.overall || 0).toFixed(1)), attendanceAvg: parseFloat((csAvg.attendance || 0).toFixed(1)), riskCount: 0 },
      { department: 'Mathematics', avgScore: parseFloat((mathAvg.overall || 0).toFixed(1)), attendanceAvg: parseFloat((mathAvg.attendance || 0).toFixed(1)), riskCount: 1 },
      { department: 'Natural Sciences', avgScore: parseFloat((sciAvg.overall || 0).toFixed(1)), attendanceAvg: parseFloat((sciAvg.attendance || 0).toFixed(1)), riskCount: 1 }
    ];

    // Fetch recent activity logs
    const logs = await ActivityLog.findAll({
      order: [['timestamp', 'DESC']],
      limit: 5,
      include: [{ model: User, attributes: ['email', 'role'] }]
    });

    const recentActivities = logs.map(log => {
      const diffMs = new Date() - new Date(log.timestamp);
      const diffMins = Math.floor(diffMs / 60000);
      let timeStr = 'Just now';
      if (diffMins > 0 && diffMins < 60) {
        timeStr = `${diffMins} mins ago`;
      } else if (diffMins >= 60) {
        timeStr = `${Math.floor(diffMins / 60)} hours ago`;
      }

      const userName = log.User ? log.User.email : 'System';
      const userRole = log.User ? log.User.role : 'System';
      const capitalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

      return {
        id: `act-${log.id}`,
        time: timeStr,
        user: userName,
        role: capitalizedRole,
        action: `${log.action.replace(/_/g, ' ')}: ${log.details || ''}`
      };
    });

    return res.status(200).json({
      totalStudents: studentCount,
      totalTeachers: teacherCount,
      totalCourses: courseCount,
      activeClasses: classCount,
      campusAcademicHealthIndex: stats.averageAcademicHealth,
      riskDistribution: {
        low: stats.riskDistribution.Low || 0,
        medium: stats.riskDistribution.Medium || 0,
        high: stats.riskDistribution.High || 0,
        critical: 0
      },
      departmentPerformance,
      recentActivities
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ error: 'Internal server error loading admin statistics.' });
  }
};

// List all students
export const getAdminStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: User, attributes: ['email', 'role'] },
        Class
      ]
    });
    return res.status(200).json(students);
  } catch (error) {
    console.error('Admin students error:', error);
    return res.status(500).json({ error: 'Internal server error loading student records.' });
  }
};

// List all teachers
export const getAdminTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [{ model: User, attributes: ['email', 'role'] }]
    });
    return res.status(200).json(teachers);
  } catch (error) {
    console.error('Admin teachers error:', error);
    return res.status(500).json({ error: 'Internal server error loading teacher records.' });
  }
};

// List all courses
export const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: Teacher, attributes: ['firstName', 'lastName'] }]
    });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Admin courses error:', error);
    return res.status(500).json({ error: 'Internal server error loading course catalog.' });
  }
};

// List all classes
export const getAdminClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    return res.status(200).json(classes);
  } catch (error) {
    console.error('Admin classes error:', error);
    return res.status(500).json({ error: 'Internal server error loading classes.' });
  }
};

// Global institutional analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    const stats = await analyticsService.getGlobalAnalytics();
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Admin analytics error:', error);
    return res.status(500).json({ error: 'Internal server error loading database analytics.' });
  }
};

// At-risk student classification list
export const getAdminRisks = async (req, res) => {
  try {
    const students = await Student.findAll();
    const atRiskList = [];

    for (const student of students) {
      const stats = await analyticsService.getStudentAnalytics(student.id);
      const health = stats.academicSummary.academicHealth;
      const att = stats.academicSummary.attendanceRate;

      let riskLevel = 'Low';
      if (health < 55 || att < 65) {
        riskLevel = 'High';
      } else if (health < 72 || att < 75 || stats.weakSubjects.length > 0) {
        riskLevel = 'Medium';
      }

      if (riskLevel === 'High' || riskLevel === 'Medium') {
        atRiskList.push({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId,
          riskLevel,
          academicHealth: health,
          attendanceRate: att,
          weakSubjects: stats.weakSubjects.map(ws => ws.subject),
          reasons: stats.weakSubjects.map(ws => ws.reason)
        });
      }
    }

    return res.status(200).json(atRiskList);
  } catch (error) {
    console.error('Admin risks error:', error);
    return res.status(500).json({ error: 'Internal server error pulling at-risk details.' });
  }
};

// Pull institutional report data for a class group
export const getAdminReports = async (req, res) => {
  const { classId } = req.query;

  if (!classId) {
    return res.status(400).json({ error: 'classId query parameter is required to generate class report.' });
  }

  try {
    const report = await reportService.generateClassReport(parseInt(classId));
    return res.status(200).json(report);
  } catch (error) {
    console.error('Admin report error:', error);
    return res.status(500).json({ error: 'Internal server error generating class report.' });
  }
};

// Pull audit log of user activities
export const getAdminActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      order: [['timestamp', 'DESC']],
      limit: 100,
      include: [{ model: User, attributes: ['email', 'role'] }]
    });
    return res.status(200).json(logs);
  } catch (error) {
    console.error('Admin activity error:', error);
    return res.status(500).json({ error: 'Internal server error pulling activity logs.' });
  }
};
