import analyticsService from './analyticsService.js';

class AIService {
  /**
   * Generates the academic report, performance analysis, recommendations, and insights.
   * Runs Gemini API if key is available, else runs the deterministic fallback engine.
   */
  async getStudentAnalysis(studentId) {
    // 1. Fetch raw computed metrics
    const stats = await analyticsService.getStudentAnalytics(studentId);
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        return await this.generateWithGemini(stats, apiKey);
      } catch (error) {
        console.error('Gemini API failed or timed out. Falling back to deterministic analysis:', error.message);
        return this.generateDeterministicAnalysis(stats);
      }
    } else {
      return this.generateDeterministicAnalysis(stats);
    }
  }

  /**
   * Calls Google Gemini 2.5 Flash API to get structured AI insights.
   */
  async generateWithGemini(stats, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `
You are an expert Academic Intelligence AI assistant. Analyze the following student academic performance metrics and return a structured analysis in JSON format.

STUDENT INFO:
Name: ${stats.studentInfo.firstName} ${stats.studentInfo.lastName} (Roll: ${stats.studentInfo.studentId})
Class: ${stats.studentInfo.className}

ACADEMIC SUMMARY:
Academic Health: ${stats.academicSummary.academicHealth}/100
Overall Attendance Rate: ${stats.academicSummary.attendanceRate}%
Overall Assignment Score: ${stats.academicSummary.assignmentScore}%
Overall Examination Score: ${stats.academicSummary.examinationScore}%
Performance Trend: ${stats.academicSummary.trend}

SUBJECT-BY-SUBJECT BREAKDOWN:
${stats.subjects.map(s => `- ${s.courseName} (${s.courseCode}): Score=${s.overallScore}%, Attendance=${s.attendanceRate}%, Class Avg=${s.classAverageScore}%`).join('\n')}

WEAK SUBJECTS IDENTIFIED BY SYSTEM:
${stats.weakSubjects.map(w => `- ${w.subject}: Score=${w.overallScore}%, Attendance=${w.attendanceRate}%, Reason: ${w.reason}`).join('\n')}

You MUST respond with a JSON object matching this schema. Do not output markdown, HTML, or conversational text outside the JSON.

SCHEMA:
{
  "academicHealth": number,
  "riskLevel": "Low" | "Medium" | "High",
  "reasons": string[],
  "recommendedAction": string,
  "trends": string[],
  "personalizedRecommendations": string[],
  "teacherInsights": string,
  "adminInsights": string
}

INSTRUCTIONS FOR AI GENERATION:
- "academicHealth": Compute a score out of 100 based on performance.
- "riskLevel": Set to High if scores/attendance are dangerously low; Medium if lagging; Low if stable/improving.
- "reasons": Detail why they are at this risk level, citing specific numbers from the data.
- "recommendedAction": Immediate next step (e.g. tutoring, parent conference).
- "trends": List noticeable trends (e.g., "Mathematics grade is below class average by X%").
- "personalizedRecommendations": List actionable, specific study/attendance tips for the student.
- "teacherInsights": Diagnostic suggestions for the teacher to help this student in the classroom.
- "adminInsights": Institutional risk assessment summary.
`;

    const requestBody = {
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    // Implement a 6-second timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Parse and return the structured response
    const aiResult = JSON.parse(textResponse.trim());
    return {
      studentInfo: stats.studentInfo,
      academicSummary: stats.academicSummary,
      subjects: stats.subjects,
      weakSubjects: stats.weakSubjects,
      aiAnalysis: {
        academicHealth: aiResult.academicHealth || stats.academicSummary.academicHealth,
        riskLevel: aiResult.riskLevel || 'Low',
        reasons: aiResult.reasons || [],
        recommendedAction: aiResult.recommendedAction || '',
        trends: aiResult.trends || [],
        personalizedRecommendations: aiResult.personalizedRecommendations || [],
        teacherInsights: aiResult.teacherInsights || '',
        adminInsights: aiResult.adminInsights || ''
      },
      source: 'Gemini AI Engine'
    };
  }

  /**
   * Deterministic Fallback Engine.
   * Generates highly detailed academic diagnostics based on static rule evaluations.
   */
  generateDeterministicAnalysis(stats) {
    const health = stats.academicSummary.academicHealth;
    const att = stats.academicSummary.attendanceRate;
    const assign = stats.academicSummary.assignmentScore;
    const exam = stats.academicSummary.examinationScore;
    const trend = stats.academicSummary.trend;
    const weakCount = stats.weakSubjects.length;

    // Determine Risk Level
    let riskLevel = 'Low';
    if (health < 55 || att < 65) {
      riskLevel = 'High';
    } else if (health < 72 || att < 75 || weakCount > 0) {
      riskLevel = 'Medium';
    }

    // Determine Reasons
    const reasons = [];
    if (att < 75) {
      reasons.push(`Attendance rate is ${att.toFixed(1)}%, which is below the minimum required 75%.`);
    }
    if (assign < 60) {
      reasons.push(`Assignment submission marks are critically low (${assign.toFixed(1)}%), indicating gaps in homework compliance.`);
    }
    if (exam < 60) {
      reasons.push(`Average examination performance is weak at ${exam.toFixed(1)}%, signaling potential difficulty with high-stakes tests.`);
    }
    if (trend === 'Declining') {
      reasons.push('Chronological performance records show a declining trajectory across recent assessments.');
    }
    stats.weakSubjects.forEach(ws => {
      reasons.push(`Academic performance is lagging in ${ws.subject} (${ws.overallScore}% score).`);
    });

    if (reasons.length === 0) {
      reasons.push('The student displays solid grades, consistent attendance, and stable or improving trends.');
    }

    // Recommended Action
    let recommendedAction = 'Maintain current study regimen and join enrichment activities.';
    if (riskLevel === 'High') {
      recommendedAction = 'Schedule an immediate parent-teacher consultation and register for mandatory credit recovery/remedial support.';
    } else if (riskLevel === 'Medium') {
      recommendedAction = 'Enroll student in subject-specific tutoring and schedule a goal-setting session with academic advising.';
    }

    // Trends list
    const trends = [];
    if (trend === 'Declining') {
      trends.push('Assessment scores are on a downward trend over the course of the semester.');
    } else if (trend === 'Improving') {
      trends.push('Student marks show positive growth over successive assignments and examinations.');
    } else {
      trends.push('Academic performance is stable, maintaining a consistent range.');
    }

    stats.subjects.forEach(s => {
      if (s.performanceGap < -10) {
        trends.push(`Performance in ${s.courseName} is significantly lower than class average (Gap: ${s.performanceGap}%).`);
      } else if (s.performanceGap > 10) {
        trends.push(`Excelled in ${s.courseName}, outperforming class average by +${s.performanceGap}%.`);
      }
    });

    // Personalized study recommendations
    const personalizedRecommendations = [];
    if (att < 75) {
      personalizedRecommendations.push('Prioritize daily class attendance and connect with instructors to review lectures missed.');
    }
    if (assign < 70) {
      personalizedRecommendations.push('Set up calendar reminders for due dates and submit all future assignments on time.');
    }
    if (exam < 70) {
      personalizedRecommendations.push('Create structured study guides and practice test formats at least 5 days prior to exams.');
    }
    stats.weakSubjects.forEach(ws => {
      personalizedRecommendations.push(`Request extra help from the tutor or teacher for ${ws.subject}. Complete previous years' question worksheets.`);
    });

    if (personalizedRecommendations.length === 0) {
      personalizedRecommendations.push('Participate in study groups to assist peers and challenge yourself with advanced topics.');
    }

    // Teacher Insights
    let teacherInsights = 'Student is performing adequately. Encourage classroom participation.';
    if (stats.weakSubjects.length > 0) {
      teacherInsights = `Classroom Intervention Needed: Student is struggling in ${stats.weakSubjects.map(ws => ws.subject).join(', ')}. Recommend offering optional office-hour reviews and tracking homework logs closely.`;
    } else if (att < 75) {
      teacherInsights = `Attendance-Related Risk: Attendance is below 75%. Please verify if the student is struggling to follow class lectures due to missed classes.`;
    }

    // Admin Insights
    let adminInsights = `Student profile is stable. Risk Level: ${riskLevel}. No action required at this moment.`;
    if (riskLevel === 'High') {
      adminInsights = `High Alert: Student is academically at-risk. Overall health index is ${health.toFixed(1)}% with an attendance rate of ${att.toFixed(1)}%. Support counseling division needs to be notified.`;
    } else if (riskLevel === 'Medium') {
      adminInsights = `Monitoring Advised: Student shows moderate academic risk due to low scores in ${stats.weakSubjects.length} courses. Tutoring department assigned.`;
    }

    return {
      studentInfo: stats.studentInfo,
      academicSummary: stats.academicSummary,
      subjects: stats.subjects,
      weakSubjects: stats.weakSubjects,
      aiAnalysis: {
        academicHealth: health,
        riskLevel,
        reasons,
        recommendedAction,
        trends,
        personalizedRecommendations,
        teacherInsights,
        adminInsights
      },
      source: 'EduPulse Analytics Fallback Engine'
    };
  }

  /**
   * Aggregates class-level insights for a teacher.
   */
  async getTeacherClassInsights(classId) {
    const classData = await analyticsService.getClassAnalytics(classId);
    
    const weakSubjectsCount = {};
    const studentsNeedingAttention = [];

    classData.studentsList.forEach(stud => {
      if (stud.riskLevel === 'High' || stud.riskLevel === 'Medium') {
        studentsNeedingAttention.push({
          id: stud.id,
          name: `${stud.firstName} ${stud.lastName}`,
          riskLevel: stud.riskLevel,
          academicHealth: stud.academicHealth,
          attendanceRate: stud.attendanceRate,
          trend: stud.trend
        });
      }
    });

    return {
      classId,
      totalStudents: classData.totalStudents,
      classAverageHealth: classData.averageHealth,
      classAverageAttendance: classData.attendanceRate,
      atRiskCount: classData.atRiskCount,
      attentionList: studentsNeedingAttention,
      summary: `${classData.atRiskCount} student(s) in this class are categorized as having High or Medium academic risk. The primary drivers are irregular attendance and declining recent exam grades.`
    };
  }

  /**
   * Aggregates global institutional insights for administrators.
   */
  async getAdminInsights() {
    const adminStats = await analyticsService.getGlobalAnalytics();

    const lowAttendanceCount = adminStats.coursePerformance.filter(c => c.averageAttendance < 75).length;
    const weakCourses = adminStats.coursePerformance.filter(c => c.averageScore < 65).map(c => c.name);

    return {
      totalStudents: adminStats.totalStudents,
      totalCourses: adminStats.totalCourses,
      globalAcademicHealth: adminStats.averageAcademicHealth,
      globalAttendanceRate: adminStats.averageAttendanceRate,
      atRiskDistribution: adminStats.riskDistribution,
      trendDistribution: adminStats.trendDistribution,
      topWeakSubjects: adminStats.weakSubjectTally,
      teacherAlerts: {
        coursesNeedingReview: weakCourses,
        lowAttendanceCoursesCount: lowAttendanceCount
      },
      summary: `EduPulse institutional audit completed. Out of ${adminStats.totalStudents} total students, ${adminStats.riskDistribution.High} are under High academic risk and ${adminStats.riskDistribution.Medium} under Medium risk. The primary institution-wide weakness is centered in courses: ${weakCourses.join(', ') || 'None'}.`
    };
  }
}

export default new AIService();
