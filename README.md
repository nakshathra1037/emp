# EduPulse AI — Academic Intelligence Education Portal
### BUILDATHON 2026 Round 1 Submission | KIT Coimbatore Student Project

EduPulse AI is a complete education management platform built for Students, Faculty, and Leadership of **Kalaignar Karunanidhi Institute of Technology (KIT Coimbatore)** with an integrated Academic Intelligence Engine.

---

## 🏆 BUILDATHON 2026 Project Architecture

- **Frontend & UI/UX**: Built with Vite + React 19, TailwindCSS, Lucide Icons, and Recharts.
- **Theme**: Red & White Light Theme (`#dc2626` / `#ffffff`) featuring the official KIT Coimbatore Sunburst Logo (`kit-logo.png`) and KIT Campus Photography.
- **Authentication**: Production-grade role-based authentication supporting Student, Teacher, and Administrator portals with real form validation, error messaging, and session persistence (`localStorage`).
- **Academic Intelligence Engine**: Multi-variate risk calculation processing Attendance %, Assignment Scores %, and Exam Marks % to answer 3 core questions:
  1. **WHAT** is happening? (Overall Academic Health Meter & Risk Status)
  2. **WHY** is it happening? (Weak Subject Identification & Root Cause Analysis)
  3. **WHAT** to improve? (Personalized Step-by-Step AI Interventions)

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production verification
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 🔑 Default Institutional Credentials for Hackathon Evaluators

| Role | Email | Password | Landing Portal |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `alex.mercer@edupulse.edu` | `password123` | `/student/dashboard` |
| 👩‍🏫 **Teacher** | `sarah.jenkins@edupulse.edu` | `password123` | `/teacher/dashboard` |
| 🏛️ **Admin** | `admin@edupulse.edu` | `password123` | `/admin/dashboard` |

---

## 🛠 Tech Stack
- React 19
- Vite
- TailwindCSS v4
- Recharts (Data Visualization)
- Lucide React (Icons)
