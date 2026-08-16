import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CalendarCheck, FileText, Award, Cpu } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { RiskBadge } from '../../components/common/Badge';

export const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherDash();
  }, []);

  const fetchTeacherDash = async () => {
    setLoading(true);
    try {
      const res = await apiService.getTeacherDashboard('tch_201');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-500 font-medium">Loading Teacher Dashboard...</div>;

  const { teacher, assignedCourses, studentsCount, pendingAssignmentsToGrade, atRiskStudents } = data;

  return (
    <div className="space-y-8">
      {/* Teacher Welcome Header */}
      <div className="glass-panel p-6 sm:p-8 border-red-200 bg-white flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
              {teacher.department} • {teacher.designation}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Welcome, {teacher.name}</h1>
          <p className="text-xs text-slate-600 font-medium">Overseeing {assignedCourses.length} assigned courses & {studentsCount} enrolled students.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/teacher/attendance">
            <Button variant="primary" size="sm" icon={CalendarCheck}>
              Record Attendance
            </Button>
          </Link>
          <Link to="/teacher/ai-insights">
            <Button variant="outline" size="sm" icon={Cpu}>
              AI Insights
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Courses</span>
          <div className="text-3xl font-black text-slate-900">{assignedCourses.length}</div>
          <p className="text-xs text-slate-500 font-medium">CS-301 & CS-305</p>
        </Card>

        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
          <div className="text-3xl font-black text-red-600">{studentsCount}</div>
          <p className="text-xs text-slate-500 font-medium">Across 2 Sections</p>
        </Card>

        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Grading</span>
          <div className="text-3xl font-black text-slate-900">{pendingAssignmentsToGrade}</div>
          <p className="text-xs text-slate-500 font-medium">Submissions awaiting review</p>
        </Card>

        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students Needing Attention</span>
          <div className="text-3xl font-black text-amber-600">{atRiskStudents.length}</div>
          <p className="text-xs text-slate-500 font-medium">Flagged by AI Engine</p>
        </Card>
      </div>

      {/* Quick Action Shortcuts & At-Risk Watch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* At-Risk Students Watch list */}
        <Card title="Students Needing Immediate Attention" subtitle="Flagged via Attendance & Low Exam Scores">
          <div className="space-y-3">
            {atRiskStudents.map((st) => (
              <div key={st.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{st.name}</span>
                    <span className="text-xs font-mono text-slate-500">({st.rollNo})</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Weak Area: <strong className="text-amber-700">{st.weakSubject}</strong> • Attendance: {st.attendance}%</p>
                </div>
                <RiskBadge level={st.riskLevel} />
              </div>
            ))}
          </div>
        </Card>

        {/* Course Quick Actions */}
        <Card title="Faculty Quick Shortcuts" subtitle="Fast management workflows">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/teacher/attendance" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-300 transition-all text-left space-y-1">
              <CalendarCheck className="w-5 h-5 text-red-600" />
              <div className="font-bold text-sm text-slate-900">Take Attendance</div>
              <p className="text-[11px] text-slate-500 font-medium">Record lecture turnout</p>
            </Link>

            <Link to="/teacher/assignments" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-300 transition-all text-left space-y-1">
              <FileText className="w-5 h-5 text-red-600" />
              <div className="font-bold text-sm text-slate-900">Publish Assignment</div>
              <p className="text-[11px] text-slate-500 font-medium">Create new student task</p>
            </Link>

            <Link to="/teacher/exams" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-300 transition-all text-left space-y-1">
              <Award className="w-5 h-5 text-red-600" />
              <div className="font-bold text-sm text-slate-900">Enter Exam Marks</div>
              <p className="text-[11px] text-slate-500 font-medium">Batch marksheets grid</p>
            </Link>

            <Link to="/teacher/ai-insights" className="p-4 rounded-2xl bg-red-50/60 border border-red-200 hover:border-red-400 transition-all text-left space-y-1">
              <Cpu className="w-5 h-5 text-red-600" />
              <div className="font-bold text-sm text-red-900">AI Risk Matrix</div>
              <p className="text-[11px] text-red-700 font-medium">Class diagnostics</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
