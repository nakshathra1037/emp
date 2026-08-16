# EduPulse AI Backend API Contract

This document outlines the API specifications, authentication, and role authorization requirements for the **EduPulse AI** backend portal. All request and response formats are in JSON.

---

## Authentication

All protected endpoints require a JWT token passed in the `Authorization` header:
`Authorization: Bearer <TOKEN>`

---

## Auth Endpoints

### 1. User Login
- **URL**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "student.charlie@edupulse.edu",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful.",
    "token": "JWT_TOKEN_HERE",
    "user": {
      "id": 6,
      "email": "student.charlie@edupulse.edu",
      "role": "student",
      "name": "Charlie Stone",
      "studentId": 3,
      "teacherId": null,
      "adminId": null
    }
  }
  ```

### 2. User Session Verification
- **URL**: `GET /api/auth/me`
- **Access**: Authenticated
- **Response (200 OK)**:
  ```json
  {
    "user": {
      "id": 6,
      "email": "student.charlie@edupulse.edu",
      "role": "student"
    },
    "profile": {
      "id": 3,
      "userId": 6,
      "firstName": "Charlie",
      "lastName": "Stone",
      "studentId": "STU-1003",
      "classId": 1
    }
  }
  ```

### 3. User Logout
- **URL**: `POST /api/auth/logout`
- **Access**: Authenticated
- **Response (200 OK)**:
  ```json
  {
    "message": "Logout successful."
  }
  ```

---

## Public & Enrollment Endpoints

### 1. List Courses
- **URL**: `GET /api/courses`
- **Access**: Public
- **Query Params**: `teacherId` (optional)
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Mathematics 101",
      "code": "MATH101",
      "description": "Algebra, Trigonometry, and introductory Calculus concepts.",
      "teacherId": 1,
      "Teacher": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "employeeId": "TCH-101"
      }
    }
  ]
  ```

### 2. Search Courses
- **URL**: `GET /api/courses/search`
- **Access**: Public
- **Query Params**: `q` (required search term, matches name or code)
- **Response (200 OK)**: Returns courses matching the query.

### 3. Course Details
- **URL**: `GET /api/courses/:id`
- **Access**: Public
- **Response (200 OK)**:
  ```json
  {
    "course": {
      "id": 1,
      "name": "Mathematics 101",
      "code": "MATH101"
    },
    "classes": [
      {
        "id": 1,
        "name": "Class 2026-A",
        "scheduleInfo": "Mon-Fri 9:00 AM - 1:00 PM",
        "room": "Room 301"
      }
    ]
  }
  ```

### 4. Course Enrollment
- **URL**: `POST /api/courses/enroll`
- **Access**: Authenticated (Students can only enroll themselves)
- **Request Body**:
  ```json
  {
    "studentId": 3,
    "courseId": 1
  }
  ```
- **Response (201 Created)**: Returns the new enrollment record.

---

## Student Endpoints
*All student endpoints require `Authorization: Bearer <TOKEN>` and role must be `student`.*

### 1. Student Dashboard Summary
- **URL**: `GET /api/student/dashboard`
- **Response (200 OK)**: Returns student's upcoming assignments, recent grades, and enrolled courses count.

### 2. Student Profile
- **URL**: `GET /api/student/profile`
- **Response (200 OK)**: Student and Class object details.

### 3. Enrolled Courses
- **URL**: `GET /api/student/courses`
- **Response (200 OK)**: Array of Course details.

### 4. Assignment List
- **URL**: `GET /api/student/assignments`
- **Response (200 OK)**: Array of assignment details with the student's submission record if submitted.

### 5. Submit Assignment
- **URL**: `POST /api/student/assignments/:id/submit`
- **Request Body**:
  ```json
  {
    "submissionText": "Detailed answers here...",
    "submissionUrl": "http://..."
  }
  ```
- **Response (200 OK)**: Returns submission status details.

### 6. View Attendance History
- **URL**: `GET /api/student/attendance`
- **Response (200 OK)**: Log of present/absent dates.

### 7. View Results & Grades
- **URL**: `GET /api/student/results`
- **Response (200 OK)**: Examination marks and auto-computed grades.

### 8. View GPA & Progress
- **URL**: `GET /api/student/progress`
- **Response (200 OK)**: Historic semester performance logs.

---

## Teacher Endpoints
*All teacher endpoints require `Authorization: Bearer <TOKEN>` and role must be `teacher`. Teachers can only modify courses they teach.*

### 1. Teacher Dashboard
- **URL**: `GET /api/teacher/dashboard`

### 2. Classes Taught
- **URL**: `GET /api/teacher/classes`

### 3. Enrolled Student Roster
- **URL**: `GET /api/teacher/students`

### 4. Record Attendance
- **URL**: `POST /api/teacher/attendance`
- **Request Body**:
  ```json
  {
    "studentId": 3,
    "courseId": 1,
    "date": "2026-11-01",
    "status": "present" // present | absent | late
  }
  ```

### 5. Edit Attendance
- **URL**: `PUT /api/teacher/attendance/:id`
- **Request Body**: `{ "status": "late" }`

### 6. Create Assignment
- **URL**: `POST /api/teacher/assignments`
- **Request Body**:
  ```json
  {
    "title": "Algebra Quiz",
    "description": "Formulas practice",
    "maxPoints": 100,
    "dueDate": "2026-11-20",
    "courseId": 1
  }
  ```

### 7. Grade Submission
- **URL**: `POST /api/teacher/submissions/:id/evaluate`
- **Request Body**:
  ```json
  {
    "pointsObtained": 85,
    "feedback": "Great logic proofs."
  }
  ```

### 8. Create Examination
- **URL**: `POST /api/teacher/exams`
- **Request Body**:
  ```json
  {
    "name": "Midterm Exam",
    "date": "2026-10-15",
    "type": "midterm", // midterm | final | quiz | other
    "maxPoints": 100,
    "courseId": 1
  }
  ```

### 9. Enter Exam Marks
- **URL**: `POST /api/teacher/marks`
- **Request Body**:
  ```json
  {
    "studentId": 3,
    "examinationId": 4,
    "pointsObtained": 72,
    "remarks": "Solid performance."
  }
  ```

---

## AI Engine & Report Endpoints

### 1. Student AI Analysis Report
- **URL**: `GET /api/ai/student/:id/analysis`
- **Access**: Student (self), Teacher, or Admin
- **Response (200 OK)**:
  ```json
  {
    "studentInfo": { "firstName": "Charlie", ... },
    "academicSummary": { "academicHealth": 53.6, "attendanceRate": 60, "trend": "Declining" },
    "subjects": [ ... ],
    "weakSubjects": [ ... ],
    "aiAnalysis": {
      "academicHealth": 53.6,
      "riskLevel": "High",
      "reasons": [
        "Attendance rate is 60.0%, which is below the minimum required 75%.",
        "Assignment submission marks are critically low (50.0%), indicating gaps in homework compliance."
      ],
      "recommendedAction": "Schedule an immediate parent-teacher consultation and register for mandatory credit recovery/remedial support.",
      "trends": [
        "Assessment scores are on a downward trend over the course of the semester."
      ],
      "personalizedRecommendations": [
        "Prioritize daily class attendance and connect with instructors to review lectures missed.",
        "Set up calendar reminders for due dates and submit all future assignments on time."
      ],
      "teacherInsights": "Classroom Intervention Needed: Student is struggling in Mathematics 101...",
      "adminInsights": "High Alert: Student is academically at-risk. Overall health index is 53.6%..."
    },
    "source": "EduPulse Analytics Fallback Engine"
  }
  ```

### 2. Student AI Recommendations Only
- **URL**: `GET /api/ai/student/:id/recommendations`
- **Access**: Student (self), Teacher, or Admin
- **Response (200 OK)**: Returns the recommendations array from the AI diagnostics.

### 3. Student PDF-Ready Structured Progress Report
- **URL**: `GET /api/ai/student/:id/report`
- **Access**: Student (self), Teacher, or Admin
- **Response (200 OK)**: Returns a complete hierarchical structure including Report Metadata, Executive Summary, Performance Scores, Subject Breakdown, Diagnostic Risk, Actionable Remedials, and Signature Blocks for printable reports.

### 4. Classroom AI Insights
- **URL**: `GET /api/ai/teacher/:classId/insights`
- **Access**: Teacher (assigned) or Admin
- **Response (200 OK)**: Aggregated health scores, student risk list, and review attention suggestions.

### 5. Admin Institutional AI Insights
- **URL**: `GET /api/ai/admin/insights`
- **Access**: Admin
- **Response (200 OK)**: Overall institutional student health index, at-risk classifications count, and top weak courses warning.

---

## Admin Endpoints
*All admin endpoints require `Authorization: Bearer <TOKEN>` and role must be `admin`.*

### 1. Overview Dashboard
- **URL**: `GET /api/admin/dashboard`

### 2. User & Model Management
- **URL**: `GET /api/admin/students`
- **URL**: `GET /api/admin/teachers`
- **URL**: `GET /api/admin/courses`
- **URL**: `GET /api/admin/classes`

### 3. Global Analytics
- **URL**: `GET /api/admin/analytics`

### 4. At-Risk Student Roll
- **URL**: `GET /api/admin/risks`

### 5. Class Group Report Sheet
- **URL**: `GET /api/admin/reports?classId=1`

### 6. System Audit Trails (Activity Monitoring)
- **URL**: `GET /api/admin/activity`
