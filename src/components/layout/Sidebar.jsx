import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  FileText,
  CalendarCheck,
  Award,
  Cpu,
  FileSpreadsheet,
  Users,
  GraduationCap,
  Layers,
  BarChart3,
  Activity,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'student';

  const navConfigs = {
    student: [
      { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/profile', label: 'Profile', icon: User },
      { path: '/student/courses', label: 'My Courses', icon: BookOpen },
      { path: '/student/assignments', label: 'Assignments', icon: FileText },
      { path: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
      { path: '/student/exams', label: 'Examinations', icon: Award },
      { path: '/student/grades', label: 'Grades & Progress', icon: BarChart3 },
      { path: '/student/ai-intelligence', label: 'AI Intelligence', icon: Cpu, badge: 'AI Engine' },
      { path: '/student/report', label: 'Performance Report', icon: FileSpreadsheet },
    ],
    teacher: [
      { path: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/teacher/courses', label: 'My Courses & Classes', icon: BookOpen },
      { path: '/teacher/students', label: 'Students Roster', icon: GraduationCap },
      { path: '/teacher/attendance', label: 'Attendance Recorder', icon: CalendarCheck },
      { path: '/teacher/assignments', label: 'Assignments', icon: FileText },
      { path: '/teacher/exams', label: 'Examinations & Marks', icon: Award },
      { path: '/teacher/ai-insights', label: 'Teacher AI Insights', icon: Cpu, badge: 'AI' },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Campus Dashboard', icon: LayoutDashboard },
      { path: '/admin/students', label: 'Manage Students', icon: GraduationCap },
      { path: '/admin/teachers', label: 'Manage Faculty', icon: Users },
      { path: '/admin/courses', label: 'Courses & Catalog', icon: BookOpen },
      { path: '/admin/classes', label: 'Class Allocations', icon: Layers },
      { path: '/admin/academic-records', label: 'Academic Records', icon: FileSpreadsheet },
      { path: '/admin/analytics', label: 'Institutional Analytics', icon: BarChart3 },
      { path: '/admin/activity', label: 'Activity Monitoring', icon: Activity },
      { path: '/admin/ai-insights', label: 'Risk & AI Engine', icon: Cpu, badge: 'Risk Matrix' },
    ],
  };

  const navItems = navConfigs[role] || navConfigs.student;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <img
              src="/assets/kit-logo.png"
              alt="KIT Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-red-600 shadow-sm flex-shrink-0"
            />
            <div className="truncate">
              <span className="font-black text-base text-slate-900 tracking-tight flex items-center gap-1">
                KIT EduPulse <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold border border-red-200">AI</span>
              </span>
              <p className="text-[9px] font-extrabold text-red-600 uppercase tracking-widest truncate">Coimbatore Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                      : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <ItemIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] rounded font-bold bg-red-100 text-red-700 border border-red-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover border border-red-200 flex-shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</div>
                <div className="text-[10px] text-red-600 font-extrabold capitalize truncate">{role} Portal</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
