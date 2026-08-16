import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, Users, ShieldCheck, AlertCircle, KeyRound, Lock, Mail, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('student.charlie@edupulse.edu');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormError('');
    if (selectedRole === 'student') setEmail('student.charlie@edupulse.edu');
    else if (selectedRole === 'teacher') setEmail('teacher.smith@edupulse.edu');
    else if (selectedRole === 'admin') setEmail('admin@edupulse.edu');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Please enter your registered institutional email and password.');
      return;
    }
    try {
      const user = await login(email, password, role);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setFormError(err.message || 'Invalid credentials or role mismatch. Please check your login details.');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden font-sans">
      
      {/* LEFT SIDE: Full-Height Dark Slate Showcase Panel */}
      <div className="lg:w-5/12 bg-slate-900 text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-800 shadow-2xl min-h-screen">
        
        {/* Top Left Corner Official KIT Sunburst Logo */}
        <div className="flex items-center gap-3.5 relative z-10">
          <img
            src="/assets/kit-logo.png"
            alt="KIT Sunburst Logo"
            className="w-16 h-16 object-contain rounded-full bg-white p-1 border-2 border-red-600 shadow-xl flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">KIT</span>
              <span className="text-xs font-mono font-bold text-slate-400 border-l border-slate-700 pl-2">COIMBATORE</span>
            </div>
            <p className="text-[11px] font-extrabold text-red-500 uppercase tracking-widest">EXCELLENCE BEYOND EXPECTATION</p>
          </div>
        </div>

        {/* Middle Main Content */}
        <div className="space-y-6 my-auto py-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-extrabold tracking-wide shadow-md border border-red-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduPulse AI Academic Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Academic Intelligence <br />
            <span className="text-red-500">Management System</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Integrated academic diagnostic engine for Students, Faculty, and Leadership of Kalaignar Karunanidhi Institute of Technology.
          </p>

          {/* Academic Excellence Promise Box (No Building Photo) */}
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-extrabold text-red-400 uppercase tracking-wider text-[11px]">
              <Award className="w-4 h-4 text-red-500" />
              <span>Academic Excellence Promise</span>
            </div>
            <p className="italic font-medium text-slate-300 leading-relaxed">
              "Empowering student potential through precision AI diagnostics, weak subject interventions, and real-time academic growth pathways."
            </p>
          </div>
        </div>

        {/* Footer Credit Note (Building Removed) */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <img src="/assets/kit-logo.png" alt="KIT Logo" className="w-6 h-6 rounded-full bg-white p-0.5 border border-red-500" />
            <span>Kalaignar Karunanidhi Institute of Technology</span>
          </div>
          <span className="font-mono text-[10px] text-red-400 font-bold">KIT COIMBATORE</span>
        </div>

      </div>

      {/* RIGHT SIDE: Full-Page Authentic Authentication Form */}
      <div className="lg:w-7/12 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-xl space-y-8">
          
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portal Authentication</h2>
            <p className="text-sm text-slate-500 font-medium">Select your academic role and enter credentials to continue</p>
          </div>

          {/* Role selection tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all ${
                role === 'student'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all ${
                role === 'teacher'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teacher</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all ${
                role === 'admin'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {(formError || error) && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3 font-medium shadow-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {role === 'student' ? 'Student Email / Roll No' : role === 'teacher' ? 'Faculty Email' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@edupulse.edu"
                  className="w-full pl-10 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotSent(false);
                  }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-red-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span className="font-semibold text-slate-700">Remember session</span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} icon={LogIn} className="w-full py-3.5 text-base font-bold shadow-lg shadow-red-600/20">
              Sign In as {role === 'student' ? 'Student' : role === 'teacher' ? 'Faculty' : 'Administrator'}
            </Button>
          </form>

          {/* Default Registered Institutional Credential Note */}
          <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 text-xs text-slate-700 space-y-1 shadow-xs">
            <span className="font-extrabold text-red-800 block uppercase text-[10px] tracking-wider">Default Registered Account Credentials:</span>
            <div className="font-mono text-red-700 font-bold text-xs">
              {role === 'student' && 'alex.mercer@edupulse.edu  |  password: password123'}
              {role === 'teacher' && 'sarah.jenkins@edupulse.edu  |  password: password123'}
              {role === 'admin' && 'admin@edupulse.edu  |  password: password123'}
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        maxWidth="max-w-md"
      >
        {forgotSent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <KeyRound className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-900">Password Reset Link Sent!</h4>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">Instructions have been sent to {forgotEmail || email}.</p>
            <Button variant="secondary" size="sm" onClick={() => setForgotModalOpen(false)} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Enter your registered KIT institutional email address below to receive a password reset link.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={forgotEmail || email}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@edupulse.edu"
                className="w-full"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
