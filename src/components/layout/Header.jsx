import React from 'react';
import { Menu, Bell, Search, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg md:hidden hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clean, Non-Overlapping Top Search Bar */}
        <div className="hidden sm:flex items-center relative max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search courses, students, reports..."
            className="pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl w-64 md:w-72 text-slate-900 placeholder-slate-400 focus:border-red-600 shadow-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-red-600" />
          <span>Public Website</span>
        </Link>

        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-red-600 absolute top-2 right-2 ring-2 ring-white" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 hidden sm:inline-block">
            {user?.name}
          </span>
          <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold rounded bg-red-100 text-red-700 border border-red-200">
            {user?.role || 'Guest'}
          </span>
        </div>
      </div>
    </header>
  );
};
