import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Public Navbar Header (Pure White Red & White Theme) */}
      <header className="h-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          
          {/* KIT Logo & Institutional Name */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/kit-logo.png"
              alt="KIT Coimbatore Logo"
              className="w-12 h-12 object-contain rounded-full bg-white p-0.5 border border-red-600 shadow-sm flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">KIT</span>
                <span className="text-xs font-mono font-extrabold text-slate-400 border-l border-slate-300 pl-2">COIMBATORE</span>
              </div>
              <p className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest">Excellence Beyond Expectation</p>
            </div>
          </Link>

          {/* Navigation Links with Red Active Underline */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-2 transition-colors ${
                  isActive ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600' : 'hover:text-red-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `relative py-2 transition-colors ${
                  isActive ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600' : 'hover:text-red-600'
                }`
              }
            >
              Courses Catalog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative py-2 transition-colors ${
                  isActive ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600' : 'hover:text-red-600'
                }`
              }
            >
              Contact & Support
            </NavLink>
          </nav>

          {/* Right Red Login / Sign Up Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={`/${user.role}/dashboard`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all border border-red-600 active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to {user.role.toUpperCase()} Portal</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all border border-red-600 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/assets/kit-logo.png" alt="KIT Logo" className="w-8 h-8 rounded-full bg-white p-0.5 border border-red-600" />
              <span className="font-bold text-base text-slate-900">KIT EduPulse AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Academic Intelligence Platform for Kalaignar Karunanidhi Institute of Technology (KIT Coimbatore), featuring real-time diagnostic AI.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px] text-red-600">Academic Portals</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/login" className="hover:text-red-600">Student Login</Link></li>
              <li><Link to="/login" className="hover:text-red-600">Faculty Login</Link></li>
              <li><Link to="/login" className="hover:text-red-600">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px] text-red-600">Academic Intelligence</h4>
            <ul className="space-y-2 font-medium">
              <li><span className="text-slate-600">Performance Risk Matrix</span></li>
              <li><span className="text-slate-600">Weak Subject Identification</span></li>
              <li><span className="text-slate-600">Personalized Recommendations</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px] text-red-600">KIT Coimbatore Campus</h4>
            <p className="text-slate-600 mb-1 font-medium">Kannampalayam, Coimbatore, Tamil Nadu 641402</p>
            <p className="text-slate-600 mb-1 font-medium">Email: info@kitcoimbatore.com</p>
            <p className="text-slate-600 font-medium">Phone: +91 422 2367890</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-slate-100 text-center text-slate-400 font-medium">
          © 2026 KIT Coimbatore — Kalaignar Karunanidhi Institute of Technology. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
