import { Student, Course, Enrollment, Assignment, AssignmentSubmission, Attendance, Examination, ExamResult, Class } from '../models/index.js';

class AnalyticsService {
  /**
   * Calculate detailed academic statistics for a single student.
   * Includes overall and course-by-course breakdown for attendance, assignments, and exams.
   */
  async getStudentAnalytics(studentId) {
    const student = await Student.findByPk(studentId, {
      include: [Class]
    });
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found.`);
    }

    // Fetch all courses the student is enrolled in
    const enrollments = await Enrollment.findAll({
      where: { studentId, status: 'enrolled' },
      include: [{ model: Course, include: [Examination, Assignment] }]
    });

    const subjectBreakdown = [];
    let totalWeightedScoreSum = 0;
    let enrolledCoursesCount = 0;

    let overallAttendanceTotalDays = 0;
    let overallAttendancePresentDays = 0;

    let overallAssignmentMaxPoints = 0;
    let overallAssignmentObtainedPoints = 0;
    let overallAssignmentSubmissionsCount = 0;
    let overallAssignmentTotalCreated = 0;

    let overallExamMaxPoints = 0;
    let overallExamObtainedPoints = 0;
    let overallExamCount = 0;

    // We will collect chronological records for trend detection
    const chronologicalScores = [];

    for (const enrollment of enrollments) {
      const course = enrollment.Course;
      enrolledCoursesCount++;

      // 1. Calculate Attendance for this course
      const attendanceRecords = await Attendance.findAll({
        where: { studentId, courseId: course.id }
      });
      const totalAttendanceDays = attendanceRecords.length;
      let presentDays = 0;
      attendanceRecords.forEach(att => {
        if (att.status === 'present') {
          presentDays += 1;
        } else if (att.status === 'late') {
          presentDays += 0.5; // Late counts as half attendance
        }
      });
      const attendanceRate = totalAttendanceDays > 0 ? (presentDays / totalAttendanceDays) * 100 : 100;
      
      overallAttendanceTotalDays += totalAttendanceDays;
      overallAttendancePresentDays += presentDays;

      // 2. Calculate Assignment Performance for this course
      const courseAssignments = await Assignment.findAll({
        where: { courseId: course.id }
      });
      const assignmentIds = courseAssignments.map(a => a.id);
      
      let courseAssignmentObtained = 0;
      let courseAssignmentMax = 0;
      let courseAssignmentSubmissions = 0;

      if (assignmentIds.length > 0) {
        const submissions = await AssignmentSubmission.findAll({
          where: {
            studentId,
            assignmentId: assignmentIds,
            status: 'graded'
          },
          include: [Assignment]
        });

        submissions.forEach(sub => {
          courseAssignmentObtained += sub.pointsObtained || 0;
          courseAssignmentMax += sub.Assignment.maxPoints || 100;
          courseAssignmentSubmissions++;

          // Push to chronological for trends
          chronologicalScores.push({
            date: sub.submittedAt,
            percentage: sub.Assignment.maxPoints > 0 ? ((sub.pointsObtained || 0) / sub.Assignment.maxPoints) * 100 : 0,
            type: 'assignment',
            subject: course.name
          });
        });
      }
      
      const assignmentScore = courseAssignmentMax > 0 ? (courseAssignmentObtained / courseAssignmentMax) * 100 : 100;
      overallAssignmentMaxPoints += courseAssignmentMax;
      overallAssignmentObtainedPoints += courseAssignmentObtained;
      overallAssignmentSubmissionsCount += courseAssignmentSubmissions;
      overallAssignmentTotalCreated += courseAssignments.length;

      // 3. Calculate Examination Performance for this course
      const courseExams = await Examination.findAll({
        where: { courseId: course.id }
      });
      const examIds = courseExams.map(e => e.id);

      let courseExamObtained = 0;
      let courseExamMax = 0;
      let courseExamCountVal = 0;

      if (examIds.length > 0) {
        const examResults = await ExamResult.findAll({
          where: {
            studentId,
            examinationId: examIds
          },
          include: [Examination]
        });

        examResults.forEach(res => {
          courseExamObtained += res.pointsObtained || 0;
          courseExamMax += res.Examination.maxPoints || 100;
          courseExamCountVal++;

          // Push to chronological for trends
          chronologicalScores.push({
            date: res.createdAt, // Or exam date if recorded
            percentage: res.Examination.maxPoints > 0 ? ((res.pointsObtained || 0) / res.Examination.maxPoints) * 100 : 0,
            type: 'exam',
            subject: course.name
          });
        });
      }

      const examinationScore = courseExamMax > 0 ? (courseExamObtained / courseExamMax) * 100 : 100;
      overallExamMaxPoints += courseExamMax;
      overallExamObtainedPoints += courseExamObtained;
      overallExamCount += courseExamCountVal;

      // 4. Subject Weighted Academic Health
      // Standard Formula: 20% Attendance, 30% Assignments, 50% Exams
      const subjectWeightedScore = (0.2 * attendanceRate) + (0.3 * assignmentScore) + (0.5 * examinationScore);
      totalWeightedScoreSum += subjectWeightedScore;

      // 5. Course class-level average for comparative analytics
      const classAverage = await this.getCourseAveragePerformance(course.id);

      subjectBreakdown.push({
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        attendanceRate: parseFloat(attendanceRate.toFixed(1)),
        assignmentScore: parseFloat(assignmentScore.toFixed(1)),
        examinationScore: parseFloat(examinationScore.toFixed(1)),
        overallScore: parseFloat(subjectWeightedScore.toFixed(1)),
        classAverageScore: parseFloat(classAverage.overall.toFixed(1)),
        performanceGap: parseFloat((subjectWeightedScore - classAverage.overall).toFixed(1))
      });
    }

    // Overall aggregate stats
    const overallAttendance = overallAttendanceTotalDays > 0 ? (overallAttendancePresentDays / overallAttendanceTotalDays) * 100 : 100;
    const overallAssignment = overallAssignmentMaxPoints > 0 ? (overallAssignmentObtainedPoints / overallAssignmentMaxPoints) * 100 : 100;
    const overallExamination = overallExamMaxPoints > 0 ? (overallExamObtainedPoints / overallExamMaxPoints) * 100 : 100;
    const overallAcademicHealth = enrolledCoursesCount > 0 ? (totalWeightedScoreSum / enrolledCoursesCount) : 100;

    // Detect trends
    const trend = this.calculateTrend(chronologicalScores);

    // Identify weak subjects
    const weakSubjects = subjectBreakdown
      .filter(s => s.overallScore < 60 || s.attendanceRate < 75)
      .map(s => {
        let severity = 'Medium';
        let reason = '';
        
        if (s.overallScore < 50 || s.attendanceRate < 65) {
          severity = 'High';
        }

        if (s.attendanceRate < 75 && s.overallScore < 60) {
          reason = `Low attendance (${s.attendanceRate}%) is severely impacting grades (${s.overallScore}%).`;
        } else if (s.overallScore < 60) {
          reason = `Examination or assignment scores are below expectations, resulting in an overall subject score of ${s.overallScore}%.`;
        } else {
          reason = `Class attendance is below standard (${s.attendanceRate}%), which could threaten academic status.`;
        }

        return {
          subject: s.courseName,
          code: s.courseCode,
          overallScore: s.overallScore,
          attendanceRate: s.attendanceRate,
          severity,
          reason
        };
      });

    return {
      studentInfo: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        className: student.Class ? student.Class.name : 'Unassigned'
      },
      academicSummary: {
        academicHealth: parseFloat(overallAcademicHealth.toFixed(1)),
        attendanceRate: parseFloat(overallAttendance.toFixed(1)),
        assignmentScore: parseFloat(overallAssignment.toFixed(1)),
        examinationScore: parseFloat(overallExamination.toFixed(1)),
        trend
      },
      subjects: subjectBreakdown,
      weakSubjects,
      chronologicalScores
    };
  }

  /**
   * Computes the average performance of a specific course (overall, attendance, assignment, exams)
   * by combining scores of all enrolled students.
   */
  async getCourseAveragePerformance(courseId) {
    const enrollments = await Enrollment.findAll({
      where: { courseId, status: 'enrolled' }
    });

    if (enrollments.length === 0) {
      return { overall: 100, attendance: 100, assignment: 100, exam: 100 };
    }

    let attendanceRateSum = 0;
    let assignmentScoreSum = 0;
    let examScoreSum = 0;
    let overallSum = 0;

    for (const enrollment of enrollments) {
      const studentId = enrollment.studentId;

      // Attendance
      const attendanceRecords = await Attendance.findAll({ where: { studentId, courseId } });
      const totalAtt = attendanceRecords.length;
      const present = attendanceRecords.filter(a => a.status === 'present').length + 
                      (attendanceRecords.filter(a => a.status === 'late').length * 0.5);
      const attRate = totalAtt > 0 ? (present / totalAtt) * 100 : 100;
      attendanceRateSum += attRate;

      // Assignment
      const courseAssignments = await Assignment.findAll({ where: { courseId } });
      const assIds = courseAssignments.map(a => a.id);
      let obtainedAss = 0, maxAss = 0;
      if (assIds.length > 0) {
        const subs = await AssignmentSubmission.findAll({
          where: { studentId, assignmentId: assIds, status: 'graded' },
          include: [Assignment]
        });
        subs.forEach(s => {
          obtainedAss += s.pointsObtained || 0;
          maxAss += s.Assignment.maxPoints;
        });
      }
      const assRate = maxAss > 0 ? (obtainedAss / maxAss) * 100 : 100;
      assignmentScoreSum += assRate;

      // Exam
      const courseExams = await Examination.findAll({ where: { courseId } });
      const exIds = courseExams.map(e => e.id);
      let obtainedEx = 0, maxEx = 0;
      if (exIds.length > 0) {
        const results = await ExamResult.findAll({
          where: { studentId, examinationId: exIds },
          include: [Examination]
        });
        results.forEach(r => {
          obtainedEx += r.pointsObtained || 0;
          maxEx += r.Examination.maxPoints;
        });
      }
      const examRate = maxEx > 0 ? (obtainedEx / maxEx) * 100 : 100;
      examScoreSum += examRate;

      // Combined
      overallSum += (0.2 * attRate) + (0.3 * assRate) + (0.5 * examRate);
    }

    const count = enrollments.length;
    return {
      overall: overallSum / count,
      attendance: attendanceRateSum / count,
      assignment: assignmentScoreSum / count,
      exam: examScoreSum / count
    };
  }

  /**
   * Analyzes chronological progress to detect if performance is Improving, Declining, or Stable.
   */
  calculateTrend(chronologicalScores) {
    if (chronologicalScores.length < 2) {
      return 'Stable';
    }

    // Sort chronologically by date
    const sorted = [...chronologicalScores].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Split into first half and second half
    const halfIndex = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, halfIndex);
    const secondHalf = sorted.slice(halfIndex);

    const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.percentage, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.percentage, 0) / secondHalf.length;

    const diff = secondHalfAvg - firstHalfAvg;

    if (diff > 5) return 'Improving';
    if (diff < -5) return 'Declining';
    return 'Stable';
  }

  /**
   * Get class-level aggregated metrics for a teacher dashboard.
   */
  async getClassAnalytics(classId) {
    const students = await Student.findAll({
      where: { classId }
    });

    if (students.length === 0) {
      return { totalStudents: 0, averageHealth: 100, attendanceRate: 100, atRiskCount: 0, studentsList: [] };
    }

    const studentsList = [];
    let totalHealthSum = 0;
    let totalAttendanceSum = 0;
    let atRiskCount = 0;

    for (const student of students) {
      const stats = await this.getStudentAnalytics(student.id);
      
      // Determine risk level based on logic
      let riskLevel = 'Low';
      if (stats.academicSummary.academicHealth < 55 || stats.academicSummary.attendanceRate < 65) {
        riskLevel = 'High';
        atRiskCount++;
      } else if (stats.academicSummary.academicHealth < 72 || stats.academicSummary.attendanceRate < 75) {
        riskLevel = 'Medium';
      }

      totalHealthSum += stats.academicSummary.academicHealth;
      totalAttendanceSum += stats.academicSummary.attendanceRate;

      studentsList.push({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        academicHealth: stats.academicSummary.academicHealth,
        attendanceRate: stats.academicSummary.attendanceRate,
        riskLevel,
        weakSubjectsCount: stats.weakSubjects.length,
        trend: stats.academicSummary.trend
      });
    }

    return {
      classId,
      totalStudents: students.length,
      averageHealth: parseFloat((totalHealthSum / students.length).toFixed(1)),
      attendanceRate: parseFloat((totalAttendanceSum / students.length).toFixed(1)),
      atRiskCount,
      studentsList
    };
  }

  /**
   * Get global institutional analytics for the admin dashboard.
   */
  async getGlobalAnalytics() {
    const students = await Student.findAll();
    const courses = await Course.findAll();
    const classes = await Class.findAll();

    let totalHealthSum = 0;
    let totalAttendanceSum = 0;
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;

    const riskDistribution = { High: 0, Medium: 0, Low: 0 };
    const weakSubjectTally = {};
    const trendDistribution = { Improving: 0, Stable: 0, Declining: 0 };

    for (const student of students) {
      const stats = await this.getStudentAnalytics(student.id);
      
      // Determine risk
      let riskLevel = 'Low';
      if (stats.academicSummary.academicHealth < 55 || stats.academicSummary.attendanceRate < 65) {
        riskLevel = 'High';
        highRiskCount++;
      } else if (stats.academicSummary.academicHealth < 72 || stats.academicSummary.attendanceRate < 75) {
        riskLevel = 'Medium';
        mediumRiskCount++;
      } else {
        lowRiskCount++;
      }

      riskDistribution[riskLevel]++;
      trendDistribution[stats.academicSummary.trend]++;

      totalHealthSum += stats.academicSummary.academicHealth;
      totalAttendanceSum += stats.academicSummary.attendanceRate;

      stats.weakSubjects.forEach(ws => {
        weakSubjectTally[ws.subject] = (weakSubjectTally[ws.subject] || 0) + 1;
      });
    }

    const studentCount = students.length;
    const coursePerformanceList = [];
    
    for (const course of courses) {
      const avg = await this.getCourseAveragePerformance(course.id);
      coursePerformanceList.push({
        id: course.id,
        name: course.name,
        code: course.code,
        averageScore: parseFloat(avg.overall.toFixed(1)),
        averageAttendance: parseFloat(avg.attendance.toFixed(1)),
        averageAssignment: parseFloat(avg.assignment.toFixed(1)),
        averageExam: parseFloat(avg.exam.toFixed(1))
      });
    }

    return {
      totalStudents: studentCount,
      totalCourses: courses.length,
      totalClasses: classes.length,
      averageAcademicHealth: studentCount > 0 ? parseFloat((totalHealthSum / studentCount).toFixed(1)) : 100,
      averageAttendanceRate: studentCount > 0 ? parseFloat((totalAttendanceSum / studentCount).toFixed(1)) : 100,
      riskDistribution,
      trendDistribution,
      weakSubjectTally,
      coursePerformance: coursePerformanceList
    };
  }
}

export default new AnalyticsService();
