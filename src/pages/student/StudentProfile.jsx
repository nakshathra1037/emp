import React, { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { RiskBadge } from '../../components/common/Badge';

export const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudentDashboard('std_101');
      setStudent(data.student);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Profile</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Official academic identity & enrollment credentials</p>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-6 border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <img
            src={student?.avatar}
            alt={student?.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-red-600 shadow-md"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900">{student?.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold">
              <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {student?.rollNo}
              </span>
              <span className="text-slate-600">• {student?.department}</span>
              <span className="text-slate-600">• Semester {student?.semester}</span>
            </div>
            <div className="pt-2">
              <RiskBadge level={student?.academicRisk} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Contact Details</h3>
            <div className="space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                <span>Email: {student?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span>Phone: {student?.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Guardian Information</h3>
            <div className="space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" />
                <span>Guardian: {student?.guardianName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span>Guardian Contact: {student?.guardianPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
