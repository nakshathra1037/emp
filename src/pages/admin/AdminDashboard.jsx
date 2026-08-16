import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Cpu } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { themeColors } from '../../styles/theme';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDash();
  }, []);

  const fetchAdminDash = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminDashboard();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-500 font-medium">Loading Campus Administration Portal...</div>;

  const { totalStudents, totalTeachers, totalCourses, activeClasses, campusAcademicHealthIndex, riskDistribution, departmentPerformance, recentActivities } = analytics;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border-red-200 bg-white flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
              Vice Chancellor & System Admin Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Campus Executive Dashboard</h1>
          <p className="text-xs text-slate-600 font-medium">Overseeing institutional health, department metrics, and AI risk diagnostics</p>
        </div>

        <Link to="/admin/ai-insights">
          <Button variant="primary" size="md" icon={Cpu}>
            Campus AI Risk Matrix
          </Button>
        </Link>
      </div>

      {/* Campus KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Students</span>
          <div className="text-3xl font-black text-slate-900">{totalStudents}</div>
          <p className="text-xs text-slate-500 font-medium">Across 5 Departments</p>
        </Card>

        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty Roster</span>
          <div className="text-3xl font-black text-red-600">{totalTeachers}</div>
          <p className="text-xs text-slate-500 font-medium">Professors & Lecturers</p>
        </Card>

        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Courses</span>
          <div className="text-3xl font-black text-slate-900">{totalCourses}</div>
          <p className="text-xs text-slate-500 font-medium">{activeClasses} Class Sections</p>
        </Card>

        <Card className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Academic Health</span>
          <div className="text-3xl font-black text-emerald-600">{campusAcademicHealthIndex}%</div>
          <p className="text-xs text-slate-500 font-medium">Aggregate Campus Index</p>
        </Card>
      </div>

      {/* Institutional Risk Segmentation & Dept Performance Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Distribution Card */}
        <Card title="Campus Risk Level Distribution" subtitle="Multi-tier student risk segmentation">
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-800">Low Risk Students</span>
              <span className="font-extrabold text-emerald-700 text-sm">{riskDistribution.low}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
              <span className="font-bold text-amber-800">Medium Risk Students</span>
              <span className="font-extrabold text-amber-700 text-sm">{riskDistribution.medium}</span>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex justify-between items-center text-xs">
              <span className="font-bold text-orange-800">High Risk Students</span>
              <span className="font-extrabold text-orange-700 text-sm">{riskDistribution.high}</span>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex justify-between items-center text-xs">
              <span className="font-bold text-red-800">Critical Risk (Action Required)</span>
              <span className="font-extrabold text-red-700 text-sm">{riskDistribution.critical}</span>
            </div>
          </div>
        </Card>

        {/* Department Performance Bar Chart */}
        <div className="md:col-span-2">
          <Card title="Department Academic Score Comparison" subtitle="Average exam performance per academic department">
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: themeColors.chartTooltipBg,
                      borderColor: themeColors.chartTooltipBorder,
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="avgScore" name="Avg Score %" fill="#dc2626" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="attendanceAvg" name="Attendance %" fill="#ea580c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Live Campus Activity Log */}
      <Card title="Real-Time Campus Audit Log" subtitle="Live student & faculty platform activities">
        <div className="space-y-3">
          {recentActivities.map((act) => (
            <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{act.user}</span>{' '}
                  <span className="text-slate-500 font-medium">({act.role}) — {act.action}</span>
                </div>
              </div>
              <span className="text-slate-400 font-mono flex-shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
