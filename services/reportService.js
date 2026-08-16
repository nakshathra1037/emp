import aiService from './aiService.js';
import analyticsService from './analyticsService.js';

class ReportService {
  /**
   * Generates a complete, structured, print-ready report structure for a student.
   */
  async generateStudentReport(studentId) {
    const analysis = await aiService.getStudentAnalysis(studentId);

    // Assemble report structure
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      metadata: {
        reportTitle: 'EDUPULSE AI - INDIVIDUAL ACADEMIC PROGRESS REPORT',
        institutionName: 'EduPulse Institute of Technology',
        academicTerm: 'Fall Semester 2026',
        generatedAt: reportDate,
        studentName: `${analysis.studentInfo.firstName} ${analysis.studentInfo.lastName}`,
        studentId: analysis.studentInfo.studentId,
        className: analysis.studentInfo.className,
        sourceEngine: analysis.source
      },
      executiveSummary: {
        title: 'Executive Summary',
        content: `Student ${analysis.studentInfo.firstName} ${analysis.studentInfo.lastName} currently exhibits an overall Academic Health Index of ${analysis.aiAnalysis.academicHealth}%. Academic risk is categorized as '${analysis.aiAnalysis.riskLevel}' with a performance trajectory classified as '${analysis.academicSummary.trend}'.`
      },
      performanceScores: {
        title: 'Core Performance Indicators',
        headers: ['Category', 'Obtained Score', 'Target Benchmark', 'Evaluation'],
        rows: [
          {
            category: 'Class Attendance Rate',
            score: `${analysis.academicSummary.attendanceRate}%`,
            benchmark: '75%',
            evaluation: analysis.academicSummary.attendanceRate >= 75 ? 'Pass' : 'Critical Warning'
          },
          {
            category: 'Assignment Submissions',
            score: `${analysis.academicSummary.assignmentScore}%`,
            benchmark: '60%',
            evaluation: analysis.academicSummary.assignmentScore >= 60 ? 'Satisfactory' : 'Needs Review'
          },
          {
            category: 'Examination Marks',
            score: `${analysis.academicSummary.examinationScore}%`,
            benchmark: '60%',
            evaluation: analysis.academicSummary.examinationScore >= 60 ? 'Satisfactory' : 'Critical Warning'
          }
        ]
      },
      subjectDetails: {
        title: 'Subject Breakdown & Peer Comparison',
        headers: ['Subject Name', 'Code', 'Student Overall', 'Class Average', 'Performance Gap'],
        rows: analysis.subjects.map(s => ({
          subjectName: s.courseName,
          code: s.courseCode,
          studentOverall: `${s.overallScore}%`,
          classAverage: `${s.classAverageScore}%`,
          performanceGap: s.performanceGap >= 0 ? `+${s.performanceGap}%` : `${s.performanceGap}%`
        }))
      },
      riskAnalysis: {
        title: 'Diagnostic Risk Assessment',
        riskLevel: analysis.aiAnalysis.riskLevel,
        recommendedAction: analysis.aiAnalysis.recommendedAction,
        reasons: analysis.aiAnalysis.reasons
      },
      recommendations: {
        title: 'Personalized Academic Intervention Plan',
        bullets: analysis.aiAnalysis.personalizedRecommendations
      },
      signOff: {
        title: 'Institutional Sign-Off & Verification',
        signatures: [
          { role: 'Academic Advisor / Registrar', name: '_________________________' },
          { role: 'Head Course Instructor', name: '_________________________' },
          { role: 'Student Representative / Parent', name: '_________________________' }
        ]
      }
    };
  }

  /**
   * Generates a comparative institutional class report for teachers or admins.
   */
  async generateClassReport(classId) {
    const classData = await analyticsService.getClassAnalytics(classId);

    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      metadata: {
        reportTitle: 'EDUPULSE AI - CLASS COMPARATIVE PERFORMANCE REPORT',
        institutionName: 'EduPulse Institute of Technology',
        academicTerm: 'Fall Semester 2026',
        generatedAt: reportDate,
        classGroup: `Class Group (ID: ${classId})`
      },
      classSummary: {
        totalStudents: classData.totalStudents,
        averageAcademicHealth: `${classData.averageHealth}%`,
        averageAttendanceRate: `${classData.attendanceRate}%`,
        atRiskStudentsCount: classData.atRiskCount
      },
      studentsBreakdown: {
        headers: ['Student Name', 'Roll Code', 'Health Index', 'Attendance Rate', 'Risk Classification', 'Trend'],
        rows: classData.studentsList.map(s => ({
          name: `${s.firstName} ${s.lastName}`,
          studentId: s.studentId,
          academicHealth: `${s.academicHealth}%`,
          attendanceRate: `${s.attendanceRate}%`,
          riskLevel: s.riskLevel,
          trend: s.trend
        }))
      },
      signOff: {
        title: 'Institutional Sign-Off',
        signatures: [
          { role: 'Class Advisor', name: '_________________________' },
          { role: 'Registrar Dean', name: '_________________________' }
        ]
      }
    };
  }
}

export default new ReportService();
