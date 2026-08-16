import aiService from '../services/aiService.js';
import reportService from '../services/reportService.js';
import { Course, Student, Enrollment } from '../models/index.js';

// Get AI Student analysis details
export const getStudentAIAnalysis = async (req, res) => {
  const { id } = req.params; // Student ID
  const userId = req.user.id;
  const userRole = req.user.role;
  const userStudentId = req.user.studentId;

  // Security Check: Student can only access their own analysis
  if (userRole === 'student' && userStudentId !== parseInt(id)) {
    return res.status(403).json({ error: 'Access Denied. You can only access your own academic AI analysis.' });
  }

  // Security Check: Teacher can only access students enrolled in their courses
  if (userRole === 'teacher') {
    const courseIds = (await Course.findAll({ where: { teacherId: req.user.teacherId } })).map(c => c.id);
    const enrolled = await Enrollment.findOne({ where: { studentId: id, courseId: courseIds } });
    if (!enrolled) {
      return res.status(403).json({ error: 'Access Denied. You do not teach this student.' });
    }
  }

  try {
    const analysis = await aiService.getStudentAnalysis(parseInt(id));
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('AI student analysis error:', error);
    return res.status(500).json({ error: 'Internal server error computing AI analysis.' });
  }
};

// Get personalized recommendations list for student
export const getStudentAIRecommendations = async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role;
  const userStudentId = req.user.studentId;

  if (userRole === 'student' && userStudentId !== parseInt(id)) {
    return res.status(403).json({ error: 'Access Denied. You can only view your own recommendations.' });
  }

  try {
    const analysis = await aiService.getStudentAnalysis(parseInt(id));
    return res.status(200).json({
      studentInfo: analysis.studentInfo,
      riskLevel: analysis.aiAnalysis.riskLevel,
      recommendedAction: analysis.aiAnalysis.recommendedAction,
      recommendations: analysis.aiAnalysis.personalizedRecommendations
    });
  } catch (error) {
    console.error('AI student recommendations error:', error);
    return res.status(500).json({ error: 'Internal server error generating recommendations.' });
  }
};

// Get PDF/print-ready structured report
export const getStudentAIReport = async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role;
  const userStudentId = req.user.studentId;

  if (userRole === 'student' && userStudentId !== parseInt(id)) {
    return res.status(403).json({ error: 'Access Denied. You can only view your own report.' });
  }

  try {
    const report = await reportService.generateStudentReport(parseInt(id));
    return res.status(200).json(report);
  } catch (error) {
    console.error('AI report error:', error);
    return res.status(500).json({ error: 'Internal server error compiling academic report.' });
  }
};

// Get classroom AI insights for teachers
export const getTeacherAIClassInsights = async (req, res) => {
  const { id } = req.params; // Class ID
  const userRole = req.user.role;
  const teacherId = req.user.teacherId;

  // Security Check: Verify teacher actually teaches students in this class
  if (userRole === 'teacher') {
    const courses = await Course.findAll({ where: { teacherId } });
    const courseIds = courses.map(c => c.id);

    const enrolledClassStudent = await Student.findOne({
      where: { classId: id },
      include: [{ model: Enrollment, where: { courseId: courseIds } }]
    });

    if (!enrolledClassStudent) {
      return res.status(403).json({ error: 'Access Denied. You do not teach any student in this class group.' });
    }
  }

  try {
    const insights = await aiService.getTeacherClassInsights(parseInt(id));
    return res.status(200).json(insights);
  } catch (error) {
    console.error('AI teacher insights error:', error);
    return res.status(500).json({ error: 'Internal server error compiling class insights.' });
  }
};

// Get global administrative AI insights
export const getAdminAIInsights = async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Access Denied. Institutional AI insights are restricted to admins.' });
  }

  try {
    const insights = await aiService.getAdminInsights();
    return res.status(200).json(insights);
  } catch (error) {
    console.error('AI admin insights error:', error);
    return res.status(500).json({ error: 'Internal server error compiling institutional insights.' });
  }
};
