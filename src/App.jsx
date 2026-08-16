import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentCourses } from './pages/student/StudentCourses';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentExams } from './pages/student/StudentExams';
import { StudentGrades } from './pages/student/StudentGrades';
import { StudentAIIntelligence } from './pages/student/StudentAIIntelligence';
import { StudentPerformanceReport } from './pages/student/StudentPerformanceReport';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherCourses } from './pages/teacher/TeacherCourses';
import { TeacherStudents } from './pages/teacher/TeacherStudents';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments';
import { TeacherExams } from './pages/teacher/TeacherExams';
import { TeacherAIInsights } from './pages/teacher/TeacherAIInsights';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminClasses } from './pages/admin/AdminClasses';
import { AdminAcademicRecords } from './pages/admin/AdminAcademicRecords';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminActivity } from './pages/admin/AdminActivity';
import { AdminAIInsights } from './pages/admin/AdminAIInsights';

// Protected Route Guard
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  return <DashboardLayout />;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Student Portal */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'admin', 'teacher']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/exams" element={<StudentExams />} />
            <Route path="/student/grades" element={<StudentGrades />} />
            <Route path="/student/ai-intelligence" element={<StudentAIIntelligence />} />
            <Route path="/student/report" element={<StudentPerformanceReport />} />
          </Route>

          {/* Teacher Portal */}
          <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/assignments" element={<TeacherAssignments />} />
            <Route path="/teacher/exams" element={<TeacherExams />} />
            <Route path="/teacher/ai-insights" element={<TeacherAIInsights />} />
          </Route>

          {/* Admin Portal */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/academic-records" element={<AdminAcademicRecords />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/activity" element={<AdminActivity />} />
            <Route path="/admin/ai-insights" element={<AdminAIInsights />} />
          </Route>

          {/* Catch-all Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
