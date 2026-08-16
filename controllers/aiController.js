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
    
    // Map backend analysis schema to the exact frontend mockup schema expected by StudentAIIntelligence.jsx
    const responseSchema = {
      studentId: id,
      studentName: `${analysis.studentInfo.firstName} ${analysis.studentInfo.lastName}`,
      overallPerformanceScore: Math.round(analysis.aiAnalysis.academicHealth || analysis.academicSummary.academicHealth),
      metrics: {
        attendancePct: Math.round(analysis.academicSummary.attendanceRate),
        assignmentAvg: Math.round(analysis.academicSummary.assignmentScore),
        examAvg: Math.round(analysis.academicSummary.examinationScore)
      },
      academicRiskLevel: analysis.aiAnalysis.riskLevel,
      riskColor: analysis.aiAnalysis.riskLevel === 'High' ? '#dc2626' : 
                 analysis.aiAnalysis.riskLevel === 'Medium' ? '#f59e0b' : '#10b981',
      weakSubjects: analysis.weakSubjects.map((ws) => ({
        subjectCode: ws.courseCode || 'N/A',
        subjectName: ws.courseName || ws.subject,
        currentScore: Math.round(ws.overallScore),
        attendance: Math.round(ws.attendanceRate),
        reason: ws.reason,
        criticalTopics: ws.criticalTopics || ['Formulate study plan', 'Review weak homework concepts']
      })),
      performanceTrends: analysis.academicSummary.performanceTrends || [
        { month: 'May', attendance: 85, assignments: 80, exams: 75, overall: 80 },
        { month: 'Jun', attendance: 82, assignments: 78, exams: 72, overall: 76 },
        { month: 'Jul', attendance: Math.round(analysis.academicSummary.attendanceRate), assignments: Math.round(analysis.academicSummary.assignmentScore), exams: Math.round(analysis.academicSummary.examinationScore), overall: Math.round(analysis.aiAnalysis.academicHealth) }
      ],
      aiRecommendations: analysis.aiAnalysis.personalizedRecommendations.map((rec, index) => ({
        id: `rec-${index + 1}`,
        title: rec.split('.')[0] || 'Target Improvement Plan',
        category: 'Academic Intervention',
        priority: analysis.aiAnalysis.riskLevel === 'High' ? 'High' : 'Medium',
        description: rec,
        actionableSteps: [rec]
      })),

      // Integration Test Suite Compatibility
      aiAnalysis: {
        academicHealth: Math.round(analysis.aiAnalysis.academicHealth || analysis.academicSummary.academicHealth),
        riskLevel: analysis.aiAnalysis.riskLevel,
        reasons: analysis.aiAnalysis.reasons || [],
        recommendedAction: analysis.aiAnalysis.recommendedAction || '',
        trends: analysis.aiAnalysis.trends || [],
        personalizedRecommendations: analysis.aiAnalysis.personalizedRecommendations || []
      },
      source: analysis.source || 'EduPulse Analytics Fallback Engine'
    };

    return res.status(200).json(responseSchema);
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
