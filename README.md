# EduPulse AI — Academic Intelligence Education Portal

### BUILDATHON 2026 — Round 1 | KIT Coimbatore

EduPulse AI is a role-based education management platform designed for Students, Teachers, and Administrators.

Instead of only storing academic information, EduPulse combines attendance, assignment performance, examination marks, and academic records to generate meaningful academic insights.

The core idea is simple:

> Turn academic data into early insights and actionable improvement steps.

---

## 🎯 Problem We Address

Traditional education management systems mainly show:
- Attendance
- Assignment marks
- Examination results
- Academic records

EduPulse goes one step further by connecting these data points. The Academic Intelligence layer helps answer:

### WHAT is happening?
Understand the student's overall academic health and current performance.

### WHY is it happening?
Identify weak subjects, risk factors, and important performance trends.

### WHAT should improve?
Generate personalized recommendations based on the student's academic performance.

---

## 🧠 Academic Intelligence Engine

EduPulse analyzes multiple academic indicators:

```text
Attendance
     +
Assignment Performance
     +
Examination Marks
     +
Academic Progress
          ↓
Academic Intelligence Engine
          ↓
 ┌───────────────────────────┐
 │ Academic Health Score     │
 │ Risk Classification       │
 │ Risk Reasons              │
 │ Weak Subjects             │
 │ Performance Trends        │
 │ Recommendations           │
 └───────────────────────────┘
          ↓
 Student | Teacher | Admin
```

---

## 🚀 How to Run Locally

### Start Backend API Server:
```bash
npm run dev:backend
```
The SQLite database and API server will start on [http://localhost:5000/api](http://localhost:5000/api).

### Start Frontend Portal Client:
```bash
npm run dev
```
Open the Vite port output in your browser (usually [http://localhost:5173](http://localhost:5173) or [http://localhost:5175](http://localhost:5175)).

---

## 🔑 Institutional Credentials for Evaluators

| Role | Email | Password | Landing Portal |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student.charlie@edupulse.edu` | `password123` | `/student/dashboard` |
| 👩‍🏫 **Teacher** | `sarah.jenkins@edupulse.edu` | `password123` | `/teacher/dashboard` |
| 🏛️ **Admin** | `admin@edupulse.edu` | `password123` | `/admin/dashboard` |

---

## ⚙️ Running Automated Integration Tests
You can run the end-to-end integration test runner containing 35+ backend assertions across all authentication, RBAC, and academic workflow scenarios using:
```bash
npm test
```
