import app from '../app.js';
import sequelize from '../config/database.js';

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}`;

let server;
let adminToken = '';
let teacherToken = '';
let studentToken = '';

let studentId = null;
let teacherId = null;
let mathCourseId = null;
let geometryQuizId = null;
let assignmentSubmissionId = null;
let newExamId = null;

// Helper assert function
const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ [FAIL] Assert failed: ${message}`);
    cleanupAndExit(1);
  } else {
    console.log(`✅ [PASS] ${message}`);
  }
};

const cleanupAndExit = (code = 0) => {
  if (server) {
    server.close(() => {
      console.log('Test server shut down.');
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
};

const runTests = async () => {
  try {
    // 1. Launch Server on test port
    await sequelize.sync(); // ensure tables are present
    server = app.listen(PORT, async () => {
      console.log(`Test server running at ${BASE_URL}... Starting test workflow.`);
      
      try {
        await executeTestSuite();
        cleanupAndExit(0);
      } catch (err) {
        console.error('❌ Test execution crashed:', err);
        cleanupAndExit(1);
      }
    });
  } catch (error) {
    console.error('Failed to start test runner:', error);
    process.exit(1);
  }
};

const executeTestSuite = async () => {
  console.log('\n--- PHASE 1: AUTHENTICATION TESTS ---');
  
  // Test Admin Login
  let res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@edupulse.edu', password: 'password123' })
  });
  assert(res.status === 200, 'Admin login should succeed');
  let data = await res.json();
  adminToken = data.token;
  assert(adminToken !== undefined, 'Admin token should be defined');
  assert(data.user.role === 'admin', 'Admin user role should be admin');

  // Test Teacher Login
  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sarah.jenkins@edupulse.edu', password: 'password123' })
  });
  assert(res.status === 200, 'Teacher login should succeed');
  data = await res.json();
  teacherToken = data.token;
  teacherId = data.user.teacherId;
  assert(teacherToken !== undefined, 'Teacher token should be defined');
  assert(teacherId !== null, 'Teacher ID reference should be populated');
  assert(data.user.role === 'teacher', 'User role should be teacher');

  // Test Student Login
  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student.charlie@edupulse.edu', password: 'password123' })
  });
  assert(res.status === 200, 'Student login should succeed');
  data = await res.json();
  studentToken = data.token;
  studentId = data.user.studentId;
  assert(studentToken !== undefined, 'Student token should be defined');
  assert(studentId !== null, 'Student ID reference should be populated');
  assert(data.user.role === 'student', 'User role should be student');

  // Test Get Current Session Profile
  res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Verify get current session details (/me) works');
  data = await res.json();
  assert(data.user.email === 'student.charlie@edupulse.edu', 'Email should match session owner');


  console.log('\n--- PHASE 2: SECURITY & RBAC TESTS ---');

  // Verify Student cannot access Admin Dashboard
  res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 403, 'Access to admin dashboard by student must return 403 Forbidden');

  // Verify Student cannot access Teacher Dashboard
  res = await fetch(`${BASE_URL}/api/teacher/dashboard`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 403, 'Access to teacher dashboard by student must return 403 Forbidden');

  // Verify Teacher cannot access Student Dashboard
  res = await fetch(`${BASE_URL}/api/student/dashboard`, {
    headers: { 'Authorization': `Bearer ${teacherToken}` }
  });
  assert(res.status === 403, 'Access to student dashboard by teacher must return 403 Forbidden');

  // Verify Request without Token returns 401
  res = await fetch(`${BASE_URL}/api/student/dashboard`);
  assert(res.status === 401, 'Request without authorization token must return 401 Unauthorized');


  console.log('\n--- PHASE 3: COURSE BROWSING & ENROLLMENT ---');

  // Fetch Public Courses Catalog
  res = await fetch(`${BASE_URL}/api/courses`);
  assert(res.status === 200, 'Fetch public course catalog works');
  data = await res.json();
  assert(data.length > 0, 'Course catalog should not be empty');
  const mathCourse = data.find(c => c.code === 'MATH101');
  mathCourseId = mathCourse.id;

  // Search Courses
  res = await fetch(`${BASE_URL}/api/courses/search?q=Math`);
  assert(res.status === 200, 'Search courses query works');
  data = await res.json();
  assert(data.some(c => c.code === 'MATH101'), 'Search results should return MATH101');

  // Course Details
  res = await fetch(`${BASE_URL}/api/courses/${mathCourseId}`);
  assert(res.status === 200, 'Fetch course details works');
  data = await res.json();
  assert(data.course.code === 'MATH101', 'Details should reference MATH101');
  assert(data.classes.length > 0, 'Schedule / Class detail info should be attached');


  console.log('\n--- PHASE 4: STUDENT WORKFLOW ---');

  // Fetch Student Dashboard
  res = await fetch(`${BASE_URL}/api/student/dashboard`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student dashboard loads successfully');
  data = await res.json();
  assert(data.enrolledCoursesCount > 0, 'Should show enrolled courses');

  // Fetch Student Course List
  res = await fetch(`${BASE_URL}/api/student/courses`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student courses load successfully');
  data = await res.json();
  assert(data.some(c => c.id === mathCourseId), 'Charlie should be enrolled in MATH101');

  // Fetch Student Assignments
  res = await fetch(`${BASE_URL}/api/student/assignments`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student assignments list loads successfully');
  data = await res.json();
  assert(data.length > 0, 'Should return assignments from enrolled courses');
  // Find Geometry Quiz (which is assignment[0] or math assignment)
  const mathAss = data.find(item => item.assignment.courseId === mathCourseId);
  geometryQuizId = mathAss.assignment.id;

  // Submit Homework Assignment
  res = await fetch(`${BASE_URL}/api/student/assignments/${geometryQuizId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      submissionText: 'Charlie geometry submission solutions',
      submissionUrl: 'http://edupulse.edu/charlie/math.pdf'
    })
  });
  assert(res.status === 200, 'Student submitting assignment works');
  data = await res.json();
  assignmentSubmissionId = data.submission.id;
  assert(data.submission.status === 'submitted', 'Submission status should be set to submitted');

  // Fetch Attendance Log
  res = await fetch(`${BASE_URL}/api/student/attendance`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student attendance history loads successfully');
  data = await res.json();
  assert(data.length > 0, 'Student should have attendance sheets recorded');

  // Fetch Exam Results
  res = await fetch(`${BASE_URL}/api/student/results`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student exam results load successfully');
  data = await res.json();
  assert(data.length > 0, 'Student should have midterm marks recorded');

  // Fetch Historical Progress
  res = await fetch(`${BASE_URL}/api/student/progress`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student academic progress loads successfully');


  console.log('\n--- PHASE 5: TEACHER WORKFLOW ---');

  // Teacher Dashboard
  res = await fetch(`${BASE_URL}/api/teacher/dashboard`, {
    headers: { 'Authorization': `Bearer ${teacherToken}` }
  });
  assert(res.status === 200, 'Teacher dashboard loads successfully');

  // Teacher Classes
  res = await fetch(`${BASE_URL}/api/teacher/classes`, {
    headers: { 'Authorization': `Bearer ${teacherToken}` }
  });
  assert(res.status === 200, 'Teacher class groups load successfully');

  // Teacher Student Roster
  res = await fetch(`${BASE_URL}/api/teacher/students`, {
    headers: { 'Authorization': `Bearer ${teacherToken}` }
  });
  assert(res.status === 200, 'Teacher student roster loads successfully');

  // Record Attendance
  res = await fetch(`${BASE_URL}/api/teacher/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      studentId: studentId,
      courseId: mathCourseId,
      date: '2026-11-01',
      status: 'present'
    })
  });
  assert(res.status === 201 || res.status === 200, 'Teacher recording student attendance succeeds');

  // Grade Student Submission
  res = await fetch(`${BASE_URL}/api/teacher/submissions/${assignmentSubmissionId}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      pointsObtained: 85,
      feedback: 'Good geometry proofs. Neat diagrams.'
    })
  });
  assert(res.status === 200, 'Teacher evaluating and grading a student submission succeeds');
  data = await res.json();
  assert(data.submission.status === 'graded', 'Submission status should update to graded');
  assert(data.submission.pointsObtained === 85, 'Submission score should match graded input');

  // Conduct Examination
  res = await fetch(`${BASE_URL}/api/teacher/exams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      name: 'Mathematics Final Examination',
      date: '2026-12-10',
      type: 'final',
      maxPoints: 100,
      courseId: mathCourseId
    })
  });
  assert(res.status === 201, 'Teacher registering a new examination succeeds');
  data = await res.json();
  newExamId = data.exam.id;

  // Enter Exam Marks
  res = await fetch(`${BASE_URL}/api/teacher/marks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      studentId: studentId,
      examinationId: newExamId,
      pointsObtained: 72,
      remarks: 'Stable final exam grade.'
    })
  });
  assert(res.status === 201 || res.status === 200, 'Teacher entering exam marks succeeds');
  data = await res.json();
  assert(data.result.grade === 'B', 'Exam letter grade should be computed automatically as B (72%)');


  console.log('\n--- PHASE 6: ACADEMIC INTELLIGENCE & AI ENGINE ---');

  // Student AI Diagnostics Analysis (for Charlie STU-1003)
  res = await fetch(`${BASE_URL}/api/ai/student/${studentId}/analysis`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student loading their own AI academic health analysis succeeds');
  data = await res.json();
  assert(data.aiAnalysis.academicHealth !== undefined, 'Academic health score must exist');
  assert(data.aiAnalysis.riskLevel !== undefined, 'Risk level classification must exist');
  assert(data.aiAnalysis.reasons.length > 0, 'Risk justifications must be present');
  console.log(`🤖 Source engine detected: [${data.source}]`);
  console.log(`📊 Student Health Index: ${data.aiAnalysis.academicHealth}%`);
  console.log(`⚠️ Risk Classification: ${data.aiAnalysis.riskLevel}`);

  // Student AI Study Recommendations
  res = await fetch(`${BASE_URL}/api/ai/student/${studentId}/recommendations`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student fetching personalized AI recommendations succeeds');
  data = await res.json();
  assert(data.recommendations.length > 0, 'Bullet recommendations must be generated');

  // Student PDF-ready Print Report
  res = await fetch(`${BASE_URL}/api/ai/student/${studentId}/report`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert(res.status === 200, 'Student fetching structured PDF progress report succeeds');
  data = await res.json();
  assert(data.metadata.reportTitle !== undefined, 'Report must contain Title metadata');
  assert(data.signOff.signatures.length > 0, 'Report must contain print signature lines');

  // Classroom AI Insights (Class ID: 1)
  res = await fetch(`${BASE_URL}/api/ai/teacher/1/insights`, {
    headers: { 'Authorization': `Bearer ${teacherToken}` }
  });
  assert(res.status === 200, 'Teacher fetching AI classroom group insights succeeds');
  data = await res.json();
  assert(data.classAverageHealth !== undefined, 'Class average health score must be defined');

  // Admin Global AI Insights
  res = await fetch(`${BASE_URL}/api/ai/admin/insights`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(res.status === 200, 'Admin fetching global institutional AI insights succeeds');
  data = await res.json();
  assert(data.globalAcademicHealth !== undefined, 'Global academic health index must be defined');


  console.log('\n--- PHASE 7: ADMIN WORKFLOW ---');

  // Admin Dashboard
  res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(res.status === 200, 'Admin dashboard overview statistics load');

  // Admin Analytics
  res = await fetch(`${BASE_URL}/api/admin/analytics`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(res.status === 200, 'Admin detailed global analytics load');

  // Admin Risks
  res = await fetch(`${BASE_URL}/api/admin/risks`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(res.status === 200, 'Admin list of at-risk students loads');
  data = await res.json();
  assert(data.length > 0, 'Should identify at least Charlie as at-risk');

  // Admin Reports (requires classId query)
  res = await fetch(`${BASE_URL}/api/admin/reports?classId=1`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(res.status === 200, 'Admin class report download/generation loads');

  // Admin Audit Log Activity
  res = await fetch(`${BASE_URL}/api/admin/activity`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(res.status === 200, 'Admin activity logs pull works');
  data = await res.json();
  assert(data.length > 0, 'Logs should contain active test events logged');
  assert(data.some(log => log.action === 'TEACHER_EXAM_CREATE'), 'Logs must verify exam creation recorded');

  console.log('\n===================================================================');
  console.log('🎉 SUCCESS: All 35+ end-to-end integration assertions passed successfully!');
  console.log('===================================================================');
};

runTests();
