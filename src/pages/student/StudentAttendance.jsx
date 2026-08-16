import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/Badge';

export const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudentAttendance('std_101');
      setAttendance(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading attendance data...</div>;

  const totalClasses = attendance.reduce((acc, curr) => acc + curr.total, 0);
  const totalAttended = attendance.reduce((acc, curr) => acc + curr.attended, 0);
  const overallPct = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Attendance Records & Compliance</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Subject lecture counts and 75% threshold monitoring</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
          <span className="text-slate-600 font-bold">Aggregate Attendance: </span>
          <span className={`font-black text-base ml-1 ${overallPct >= 75 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {overallPct}%
          </span>
        </div>
      </div>

      {overallPct < 75 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs font-medium shadow-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-700" />
          <span>
            <strong className="font-bold">Attendance Warning:</strong> Your aggregate attendance is currently below the mandatory 75% institutional threshold. Please prioritize upcoming lectures.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attendance.map((item, idx) => (
          <Card key={idx} className="space-y-4 bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">{item.courseName}</h3>
              <StatusBadge status={item.status} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Attended Lectures</span>
                <span className="font-bold text-slate-900">{item.attended} / {item.total}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    item.percentage >= 85
                      ? 'bg-emerald-600'
                      : item.percentage >= 75
                      ? 'bg-red-600'
                      : 'bg-amber-600'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-right text-xs font-black text-red-600">{item.percentage}%</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
