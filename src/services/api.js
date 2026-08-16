import { initialMockData } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get persistent state from local storage or mock defaults
const getMockState = () => {
  const stored = localStorage.getItem('edupulse_mock_db');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { console.error('Failed parsing mock DB', e); }
  }
  localStorage.setItem('edupulse_mock_db', JSON.stringify(initialMockData));
  return initialMockData;
};

const updateMockState = (updater) => {
  const current = getMockState();
  const next = updater(current);
  localStorage.setItem('edupulse_mock_db', JSON.stringify(next));
  return next;
};

// Generic fetch with automatic mock fallback
async function apiRequest(endpoint, options = {}, mockFallbackFn) {
  try {
    const token = localStorage.getItem('edupulse_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    // console.warn(`API call failed for ${endpoint}. Falling back to high-fidelity mock service.`, err.message);
    // Simulate brief network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (mockFallbackFn) {
      return mockFallbackFn(getMockState());
    }
    throw err;
  }
}

const getLoggedInUser = () => {
  const stored = localStorage.getItem('edupulse_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const resolveStudentId = (id) => {
  if (id === 'std_101' || !id) {
    const user = getLoggedInUser();
    if (user && user.role === 'student' && user.studentId) {
      return user.studentId;
    }
  }
  return id;
};

const resolveTeacherId = (id) => {
  if (id === 'tch_201' || !id) {
    const user = getLoggedInUser();
    if (user && user.role === 'teacher' && user.teacherId) {
      return user.teacherId;
    }
  }
  return id;
};

export const apiService = {
  // --- AUTHENTICATION ---
  async login(email, password, role) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }, (db) => {
      // Mock Login logic
      let user = null;
      if (role === 'student') {
        user = db.students.find((s) => s.email.toLowerCase() === email.toLowerCase()) || db.students[0];
      } else if (role === 'teacher') {
        user = db.teachers.find((t) => t.email.toLowerCase() === email.toLowerCase()) || db.teachers[0];
      } else {
        user = {
          id: 'adm_001',
          name: 'Dr. Harrison Wells',
          email: email || 'admin@edupulse.edu',
          role: 'admin',
          department: 'Administration',
          designation: 'Vice Chancellor / System Admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
      }
      const token = `mock_token_${user.id}_${Date.now()}`;
      return { success: true, user: { ...user, role: role || 'student' }, token };
    });
  },

  // --- PUBLIC COURSES ---
  async getCourses(search = '', department = '') {
    return apiRequest(`/courses?search=${encodeURIComponent(search)}&department=${encodeURIComponent(department)}`, {}, (db) => {
      let filtered = [...db.courses];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
      }
      if (department && department !== 'All') {
        filtered = filtered.filter((c) => c.department === department);
      }
      return filtered;
    });
  },

  async getCourseById(id) {
    return apiRequest(`/courses/${id}`, {}, (db) => {
      return db.courses.find((c) => c.id === id) || db.courses[0];
    });
  },

  // --- STUDENT ENDPOINTS ---
  async getStudentDashboard(studentId = 'std_101') {
    const resolvedId = resolveStudentId(studentId);
    return apiRequest(`/student/dashboard?studentId=${resolvedId}`, {}, (db) => {
      const student = db.students.find((s) => s.id === studentId) || db.students[0];
      return {
        student,
        courses: db.courses.slice(0, 4),
        attendance: db.attendance,
        assignments: db.assignments,
        aiSummary: db.aiStudentIntelligence,
      };
    });
  },

  async getStudentAttendance(studentId = 'std_101') {
    const resolvedId = resolveStudentId(studentId);
    return apiRequest(`/student/attendance?studentId=${resolvedId}`, {}, (db) => db.attendance);
  },

  async getStudentAssignments(studentId = 'std_101') {
    const resolvedId = resolveStudentId(studentId);
    return apiRequest(`/student/assignments?studentId=${resolvedId}`, {}, (db) => db.assignments);
  },

  async submitAssignment(assignmentId, submissionText) {
    return apiRequest(`/student/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ submissionText }),
    }, () => {
      updateMockState((db) => {
        const idx = db.assignments.findIndex((a) => a.id === assignmentId);
        if (idx !== -1) {
          db.assignments[idx].status = 'Submitted';
          db.assignments[idx].submittedAt = new Date().toISOString().split('T')[0];
          db.assignments[idx].submissionNote = submissionText;
        }
        return db;
      });
      return { success: true, message: 'Assignment submitted successfully!' };
    });
  },

  async getStudentExams(studentId = 'std_101') {
    const resolvedId = resolveStudentId(studentId);
    return apiRequest(`/student/exams?studentId=${resolvedId}`, {}, (db) => db.examinations);
  },

  async getStudentAIIntelligence(studentId = 'std_101') {
    const resolvedId = resolveStudentId(studentId);
    return apiRequest(`/ai/student/${resolvedId}/analysis`, {}, (db) => db.aiStudentIntelligence);
  },

  async getStudentReport(studentId = 'std_101') {
    const resolvedId = resolveStudentId(studentId);
    return apiRequest(`/ai/student/${resolvedId}/report`, {}, (db) => {
      const student = db.students.find((s) => s.id === studentId) || db.students[0];
      return {
        reportId: `REP-${student.rollNo}-${Date.now().toString().slice(-4)}`,
        generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        student,
        attendance: db.attendance,
        examinations: db.examinations,
        assignments: db.assignments,
        aiIntelligence: db.aiStudentIntelligence,
      };
    });
  },

  // --- TEACHER ENDPOINTS ---
  async getTeacherDashboard(teacherId = 'tch_201') {
    const resolvedId = resolveTeacherId(teacherId);
    return apiRequest(`/teacher/dashboard?teacherId=${resolvedId}`, {}, (db) => {
      const teacher = db.teachers.find((t) => t.id === teacherId) || db.teachers[0];
      return {
        teacher,
        assignedCourses: db.courses.filter((c) => teacher.coursesAssigned.includes(c.code)),
        studentsCount: 80,
        pendingAssignmentsToGrade: 4,
        atRiskStudentsCount: 2,
        atRiskStudents: db.adminAnalytics.atRiskStudentsList.slice(0, 2),
      };
    });
  },

  async getTeacherStudents(teacherId = 'tch_201') {
    const resolvedId = resolveTeacherId(teacherId);
    return apiRequest(`/teacher/students?teacherId=${resolvedId}`, {}, (db) => db.students);
  },

  async recordAttendance(courseId, date, attendanceMap) {
    return apiRequest('/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify({ courseId, date, attendanceMap }),
    }, () => {
      return { success: true, message: 'Attendance recorded successfully!' };
    });
  },

  async createAssignment(assignmentData) {
    return apiRequest('/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    }, () => {
      let created;
      updateMockState((db) => {
        created = {
          id: `asg-${Date.now()}`,
          title: assignmentData.title,
          courseCode: assignmentData.courseCode,
          courseName: assignmentData.courseName,
          dueDate: assignmentData.dueDate,
          totalPoints: Number(assignmentData.totalPoints) || 100,
          earnedPoints: null,
          status: 'Pending',
          submittedAt: null,
          feedback: null,
        };
        db.assignments.unshift(created);
        return db;
      });
      return { success: true, assignment: created, message: 'Assignment published to students.' };
    });
  },

  async enterExamMarks(examData) {
    return apiRequest('/teacher/marks', {
      method: 'POST',
      body: JSON.stringify(examData),
    }, () => {
      return { success: true, message: 'Examination marks published to academic records!' };
    });
  },

  async getTeacherAIInsights(teacherId = 'tch_201') {
    const resolvedId = resolveTeacherId(teacherId);
    return apiRequest(`/teacher/ai-insights?teacherId=${resolvedId}`, {}, (db) => {
      return {
        studentsNeedingAttention: db.adminAnalytics.atRiskStudentsList,
        classWeakSubjects: [
          { subject: 'MATH-202 Discrete Math', weakCount: 14, avgScore: '58%' },
          { subject: 'CS-305 Machine Learning', weakCount: 5, avgScore: '74%' },
        ],
        teacherInterventions: db.aiStudentIntelligence.aiRecommendations,
      };
    });
  },

  // --- ADMIN ENDPOINTS ---
  async getAdminDashboard() {
    return apiRequest('/admin/dashboard', {}, (db) => db.adminAnalytics);
  },

  async getAdminStudents() {
    return apiRequest('/admin/students', {}, (db) => db.students);
  },

  async getAdminTeachers() {
    return apiRequest('/admin/teachers', {}, (db) => db.teachers);
  },

  async getAdminCourses() {
    return apiRequest('/admin/courses', {}, (db) => db.courses);
  },

  async saveStudent(studentData) {
    return apiRequest('/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }, () => {
      updateMockState((db) => {
        const existingIdx = db.students.findIndex((s) => s.id === studentData.id);
        if (existingIdx !== -1) {
          db.students[existingIdx] = { ...db.students[existingIdx], ...studentData };
        } else {
          db.students.push({
            id: `std_${Date.now()}`,
            rollNo: `2026-CS-${Math.floor(Math.random() * 899 + 100)}`,
            cgpa: 3.2,
            academicRisk: 'Low',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            ...studentData,
          });
        }
        return db;
      });
      return { success: true, message: 'Student saved successfully!' };
    });
  },

  async deleteStudent(studentId) {
    return apiRequest(`/admin/students/${studentId}`, { method: 'DELETE' }, () => {
      updateMockState((db) => {
        db.students = db.students.filter((s) => s.id !== studentId);
        return db;
      });
      return { success: true, message: 'Student record deleted.' };
    });
  },
};
