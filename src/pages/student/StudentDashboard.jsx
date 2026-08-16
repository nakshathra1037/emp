import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarCheck, FileText, Award, Cpu, AlertTriangle, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { RiskBadge, StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiService.getStudentDashboard('std_101');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500 font-medium">Loading Student Dashboard...</div>;
  }

  const { student, courses, assignments, aiSummary } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Banner (Red & White Light Theme) */}
      <div className="glass-panel p-6 sm:p-8 border-red-200 bg-white flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
              {student.rollNo}
            </span>
            <span className="text-xs text-slate-600 font-semibold">{student.department} • Semester {student.semester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Welcome back, {student.name}!</h1>
          <p className="text-xs text-slate-600 font-medium">Your current CGPA is <strong className="text-emerald-700 font-bold">{student.cgpa}</strong>. AI Engine scan active.</p>
        </div>

        <Link to="/student/ai-intelligence">
          <Button variant="primary" size="md" icon={Cpu}>
            View AI Intelligence Suite
          </Button>
        </Link>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Health</span>
            <Cpu className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{aiSummary.overallPerformanceScore}%</div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span>Risk Status:</span>
            <RiskBadge level={aiSummary.academicRiskLevel} />
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Attendance</span>
            <CalendarCheck className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-600">{aiSummary.metrics.attendancePct}%</div>
          <div className="text-xs text-slate-500 pt-1 font-medium">
            {aiSummary.metrics.attendancePct < 75 ? (
              <span className="text-amber-700 font-bold">Below 75% threshold</span>
            ) : (
              <span className="text-emerald-700 font-bold">Healthy attendance</span>
            )}
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Assignment Avg</span>
            <FileText className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{aiSummary.metrics.assignmentAvg}%</div>
          <div className="text-xs text-slate-500 pt-1 font-medium">
            <span>{assignments.filter((a) => a.status === 'Pending').length} Pending assignments</span>
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Exam Avg</span>
            <Award className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{aiSummary.metrics.examAvg}%</div>
          <div className="text-xs text-slate-500 pt-1 font-medium">
            <span>Weak Area: <strong className="text-amber-700">{student.weakSubject}</strong></span>
          </div>
        </Card>
      </div>

      {/* AI Risk Alert Banner */}
      {aiSummary.academicRiskLevel !== 'Low' && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-900">AI Diagnostic Alert</h3>
                <RiskBadge level={aiSummary.academicRiskLevel} />
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                {aiSummary.weakSubjects[0]?.reason}
              </p>
            </div>
          </div>
          <Link to="/student/ai-intelligence">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              View Recommended Actions
            </Button>
          </Link>
        </div>
      )}

      {/* Enrolled Courses & Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enrolled Courses */}
        <Card title="Enrolled Courses" subtitle="Active semester course schedule">
          <div className="space-y-3">
            {courses.slice(0, 3).map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 mr-2">{c.code}</span>
                  <h4 className="text-sm font-bold text-slate-900 inline">{c.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">{c.schedule}</p>
                </div>
                <Link to="/student/courses">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Assignments Deadline Watch */}
        <Card title="Upcoming Assignments" subtitle="Deadlines & submission status">
          <div className="space-y-3">
            {assignments.map((asg) => (
              <div key={asg.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">{asg.courseCode}</span>
                    <StatusBadge status={asg.status} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Due: {asg.dueDate}</p>
                </div>
                {asg.status === 'Graded' ? (
                  <span className="text-xs font-bold text-red-600">{asg.earnedPoints} / {asg.totalPoints}</span>
                ) : (
                  <Link to="/student/assignments">
                    <Button variant="primary" size="sm">Submit</Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
