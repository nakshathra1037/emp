import { Teacher, Course, Student, Class, Enrollment, Attendance, Assignment, AssignmentSubmission, Examination, ExamResult } from '../models/index.js';
import { logActivity } from '../utils/activityLogger.js';
import aiService from '../services/aiService.js';
import analyticsService from '../services/analyticsService.js';

// Verify teacher ownership of course
const verifyCourseTeacher = async (courseId, teacherId) => {
  const course = await Course.findOne({ where: { id: courseId, teacherId } });
  return !!course;
};

// Teacher Dashboard summary
export const getTeacherDashboard = async (req, res) => {
  const teacherId = req.user.teacherId;

  try {
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher profile not found.' });
    }

    // Courses taught
    const courses = await Course.findAll({ where: { teacherId } });
    const courseIds = courses.map(c => c.id);

    // Students enrolled in these courses
    const enrollments = await Enrollment.findAll({
      where: { courseId: courseIds, status: 'enrolled' },
      include: [{ model: Student, include: [Class] }]
    });

    // Unique students list
    const studentMap = {};
    enrollments.forEach(e => {
      if (e.Student) {
        studentMap[e.studentId] = {
          id: e.Student.id,
          name: `${e.Student.firstName} ${e.Student.lastName}`,
          studentId: e.Student.studentId,
          className: e.Student.Class ? e.Student.Class.name : 'Unassigned'
        };
      }
    });

    const uniqueStudents = Object.values(studentMap);

    // Recent submissions needing review
    const pendingSubmissions = await AssignmentSubmission.findAll({
      where: { status: 'submitted' },
      include: [
        { model: Student, attributes: ['firstName', 'lastName'] },
        { model: Assignment, where: { courseId: courseIds }, include: [Course] }
      ],
      limit: 10
    });

    return res.status(200).json({
      teacher,
      coursesCount: courses.length,
      studentsCount: uniqueStudents.length,
      courses,
      students: uniqueStudents,
      pendingSubmissions: pendingSubmissions.map(s => ({
        id: s.id,
        assignmentTitle: s.Assignment.title,
        courseName: s.Assignment.Course.name,
        studentName: `${s.Student.firstName} ${s.Student.lastName}`,
        submittedAt: s.submittedAt
      }))
    });
  } catch (error) {
    console.error('Teacher dashboard error:', error);
    return res.status(500).json({ error: 'Internal server error loading teacher dashboard.' });
  }
};

// List assigned courses
export const getTeacherCourses = async (req, res) => {
  const teacherId = req.user.teacherId;

  try {
    const courses = await Course.findAll({ where: { teacherId } });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Teacher courses error:', error);
    return res.status(500).json({ error: 'Internal server error loading courses.' });
  }
};

// List assigned classes
export const getTeacherClasses = async (req, res) => {
  const teacherId = req.user.teacherId;

  try {
    const courses = await Course.findAll({ where: { teacherId } });
    const courseIds = courses.map(c => c.id);

    const enrollments = await Enrollment.findAll({
      where: { courseId: courseIds },
      include: [{ model: Student, include: [Class] }]
    });

    const classMap = {};
    enrollments.forEach(e => {
      if (e.Student && e.Student.Class) {
        const cls = e.Student.Class;
        classMap[cls.id] = {
          id: cls.id,
          name: cls.name,
          scheduleInfo: cls.scheduleInfo,
          room: cls.room
        };
      }
    });

    return res.status(200).json(Object.values(classMap));
  } catch (error) {
    console.error('Teacher classes error:', error);
    return res.status(500).json({ error: 'Internal server error loading classes.' });
  }
};

// Get students in classes taking teacher's courses
export const getTeacherStudents = async (req, res) => {
  const teacherId = req.user.teacherId;

  try {
    const courses = await Course.findAll({ where: { teacherId } });
    const courseIds = courses.map(c => c.id);

    const enrollments = await Enrollment.findAll({
      where: { courseId: courseIds, status: 'enrolled' },
      include: [{ model: Student, include: [Class] }]
    });

    const studentMap = {};
    enrollments.forEach(e => {
      if (e.Student) {
        studentMap[e.studentId] = {
          id: e.Student.id,
          firstName: e.Student.firstName,
          lastName: e.Student.lastName,
          studentId: e.Student.studentId,
          class: e.Student.Class ? e.Student.Class.name : 'Unassigned'
        };
      }
    });

    return res.status(200).json(Object.values(studentMap));
  } catch (error) {
    console.error('Teacher students error:', error);
    return res.status(500).json({ error: 'Internal server error loading student roster.' });
  }
};

// Record Attendance
export const recordAttendance = async (req, res) => {
  const teacherId = req.user.teacherId;
  const { studentId, courseId, date, status } = req.body;

  // Security Check: Verify teacher teaches this course
  const isAuthorized = await verifyCourseTeacher(courseId, teacherId);
  if (!isAuthorized) {
    return res.status(403).json({ error: 'Access Denied. You do not teach this course.' });
  }

  try {
    // Check if attendance already recorded for this day
    let attendance = await Attendance.findOne({ where: { studentId, courseId, date } });
    if (attendance) {
      attendance.status = status;
      await attendance.save();
      await logActivity(req.user.id, 'TEACHER_ATTENDANCE_UPDATE', `Updated student ${studentId} course ${courseId} attendance to ${status}`);
      return res.status(200).json({ message: 'Attendance updated successfully.', attendance });
    }

    attendance = await Attendance.create({
      studentId,
      courseId,
      date,
      status
    });

    await logActivity(req.user.id, 'TEACHER_ATTENDANCE_CREATE', `Logged student ${studentId} course ${courseId} attendance as ${status}`);
    return res.status(201).json({ message: 'Attendance recorded successfully.', attendance });
  } catch (error) {
    console.error('Record attendance error:', error);
    return res.status(500).json({ error: 'Internal server error logging attendance.' });
  }
};

// Update Attendance by ID
export const updateAttendance = async (req, res) => {
  const teacherId = req.user.teacherId;
  const { id } = req.params;
  const { status } = req.body;

  try {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ error: `Attendance record with ID ${id} not found.` });
    }

    const isAuthorized = await verifyCourseTeacher(attendance.courseId, teacherId);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access Denied. You do not teach this course.' });
    }

    attendance.status = status;
    await attendance.save();

    await logActivity(req.user.id, 'TEACHER_ATTENDANCE_EDIT', `Edited attendance row ${id} to status ${status}`);
    return res.status(200).json({ message: 'Attendance updated.', attendance });
  } catch (error) {
    console.error('Update attendance error:', error);
    return res.status(500).json({ error: 'Internal server error updating attendance.' });
  }
};

// Create Assignment
export const createAssignment = async (req, res) => {
  const teacherId = req.user.teacherId;
  const { title, description, maxPoints, dueDate, courseId } = req.body;

  const isAuthorized = await verifyCourseTeacher(courseId, teacherId);
  if (!isAuthorized) {
    return res.status(403).json({ error: 'Access Denied. You do not teach this course.' });
  }

  try {
    const assignment = await Assignment.create({
      title,
      description,
      maxPoints,
      dueDate,
      courseId
    });

    await logActivity(req.user.id, 'TEACHER_ASSIGNMENT_CREATE', `Created assignment '${title}' in course ${courseId}`);
    return res.status(201).json({ message: 'Assignment created successfully.', assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    return res.status(500).json({ error: 'Internal server error creating assignment.' });
  }
};

// Update Assignment Details
export const updateAssignment = async (req, res) => {
  const teacherId = req.user.teacherId;
  const { id } = req.params;
  const { title, description, maxPoints, dueDate } = req.body;

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: `Assignment with ID ${id} not found.` });
    }

    const isAuthorized = await verifyCourseTeacher(assignment.courseId, teacherId);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access Denied. You do not teach this course.' });
    }

    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (maxPoints) assignment.maxPoints = maxPoints;
    if (dueDate) assignment.dueDate = dueDate;

    await assignment.save();
    await logActivity(req.user.id, 'TEACHER_ASSIGNMENT_EDIT', `Edited assignment ${id} details.`);
    return res.status(200).json({ message: 'Assignment details updated successfully.', assignment });
  } catch (error) {
    console.error('Update assignment error:', error);
    return res.status(500).json({ error: 'Internal server error updating assignment details.' });
  }
};

// Grade/Evaluate Assignment Submission
export const evaluateSubmission = async (req, res) => {
  const teacherId = req.user.teacherId;
  const { id } = req.params; // Submission ID
  const { pointsObtained, feedback } = req.body;

  try {
    const submission = await AssignmentSubmission.findByPk(id, {
      include: [Assignment]
    });

    if (!submission) {
      return res.status(404).json({ error: `Submission with ID ${id} not found.` });
    }

    const isAuthorized = await verifyCourseTeacher(submission.Assignment.courseId, teacherId);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access Denied. You do not teach this course.' });
    }

    submission.pointsObtained = pointsObtained;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedBy = teacherId;
    await submission.save();

    await logActivity(req.user.id, 'TEACHER_EVALUATE_SUBMISSION', `Graded student ${submission.studentId} submission ID ${id} with score ${pointsObtained}`);
    return res.status(200).json({ message: 'Submission evaluated and graded.', submission });
  } catch (error) {
    console.error('Evaluate submission error:', error);
    return res.status(500).json({ error: 'Internal server error grading submission.' });
  }
};

// Create Examination
export const createExamination = async (req, res) => {
  const teacherId = req.user.teacherId;
  const { name, date, type, maxPoints, courseId } = req.body;

  const isAuthorized = await verifyCourseTeacher(courseId, teacherId);
  if (!isAuthorized) {
    return res.status(403).json({ error: 'Access Denied. You do not teach this course.' });
  }

  try {
    const exam = await Examination.create({
      name,
      date,
      type,
      maxPoints,
      courseId
    });

    await logActivity(req.user.id, 'TEACHER_EXAM_CREATE', `Created examination '${name}' in course ${courseId}`);
    return res.status(201).json({ message: 'Examination registered successfully.', exam });
  } catch (error) {
    console.error('Create examination error:', error);
    return res.status(500).json({ error: 'Internal server error creating exam.' });
  }
};

// Enter Student Exam Result/Marks
export const enterExamMarks = async (req, res) => {
  const teacherId = req.user.teacherId;
  const { studentId, examinationId, pointsObtained, remarks } = req.body;

  try {
    const exam = await Examination.findByPk(examinationId);
    if (!exam) {
      return res.status(404).json({ error: `Examination with ID ${examinationId} not found.` });
    }

    const isAuthorized = await verifyCourseTeacher(exam.courseId, teacherId);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access Denied. You do not teach this course.' });
    }

    // Automatically compute grade letter based on standard criteria
    const pct = exam.maxPoints > 0 ? (pointsObtained / exam.maxPoints) * 100 : 0;
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 50) grade = 'D';

    // Check if result already exists
    let result = await ExamResult.findOne({ where: { studentId, examinationId } });
    if (result) {
      result.pointsObtained = pointsObtained;
      result.grade = grade;
      result.remarks = remarks;
      await result.save();
      await logActivity(req.user.id, 'TEACHER_MARKS_UPDATE', `Updated student ${studentId} marks in exam ${examinationId} to ${pointsObtained}`);
      return res.status(200).json({ message: 'Exam marks updated successfully.', result });
    }

    result = await ExamResult.create({
      examinationId,
      studentId,
      pointsObtained,
      grade,
      remarks
    });

    await logActivity(req.user.id, 'TEACHER_MARKS_CREATE', `Logged student ${studentId} marks in exam ${examinationId} as ${pointsObtained}`);
    return res.status(201).json({ message: 'Exam marks recorded successfully.', result });
  } catch (error) {
    console.error('Enter marks error:', error);
    return res.status(500).json({ error: 'Internal server error saving exam results.' });
  }
};

// Aggregated teacher-class level AI insights for frontend component
export const getTeacherAIInsights = async (req, res) => {
  try {
    const classId = 1; // Default seeded class ID
    const classData = await analyticsService.getClassAnalytics(classId);
    
    const subjectTally = {};
    const attentionList = [];
    
    for (const stud of classData.studentsList) {
      const stats = await analyticsService.getStudentAnalytics(stud.id);
      
      // If student is at risk, fetch their diagnostic suggestions
      if (stud.riskLevel === 'High' || stud.riskLevel === 'Medium') {
        const studentAnalysis = await aiService.getStudentAnalysis(stud.id);
        const weakSub = stats.weakSubjects[0]?.subject || 'None';
        
        attentionList.push({
          id: stud.id,
          name: `${stud.firstName} ${stud.lastName}`,
          rollNo: stud.studentId,
          riskLevel: stud.riskLevel,
          weakSubject: weakSub,
          attendance: stats.academicSummary.attendanceRate,
          examScore: stats.academicSummary.examinationScore,
          aiRecommendation: studentAnalysis.aiAnalysis.recommendedAction
        });
      }
      
      stats.weakSubjects.forEach(ws => {
        subjectTally[ws.subject] = (subjectTally[ws.subject] || 0) + 1;
      });
    }

    const weakClusters = Object.entries(subjectTally).map(([subject, count]) => {
      const pct = classData.totalStudents > 0 ? (count / classData.totalStudents) * 100 : 0;
      return {
        topic: subject,
        percentage: parseFloat(pct.toFixed(0))
      };
    }).sort((a, b) => b.percentage - a.percentage);

    if (weakClusters.length === 0) {
      weakClusters.push({ topic: 'No major weak subjects detected', percentage: 0 });
    }

    // Compile recommendations
    const recommendations = [];
    attentionList.forEach(st => {
      recommendations.push(`Provide classroom academic intervention for ${st.name} in ${st.weakSubject}.`);
    });
    if (recommendations.length === 0) {
      recommendations.push('Class performance is strong. Keep encouraging interactive peer study groups.');
    }

    return res.status(200).json({
      classAverageScore: classData.averageHealth,
      atRiskCount: classData.atRiskCount,
      weakSubjectClusters: weakClusters,
      interventionRecommendations: recommendations,
      studentAttentionList: attentionList
    });
  } catch (error) {
    console.error('getTeacherAIInsights error:', error);
    return res.status(500).json({ error: 'Internal server error computing AI insights.' });
  }
};
