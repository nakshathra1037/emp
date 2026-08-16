import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';

export const StudentGrades = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
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

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading Grades & Progress...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Academic Progress & Transcripts</h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Cumulative GPA calculation and letter grade distributions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 space-y-2 bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative GPA</span>
          <div className="text-4xl font-black text-red-600">{data?.student?.cgpa}</div>
          <p className="text-xs text-slate-500 font-semibold">Out of 4.00 Max CGPA Scale</p>
        </Card>

        <Card className="text-center p-6 space-y-2 bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Credits</span>
          <div className="text-4xl font-black text-slate-900">84</div>
          <p className="text-xs text-slate-500 font-semibold">Target: 128 Credits for Degree</p>
        </Card>

        <Card className="text-center p-6 space-y-2 bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Standing</span>
          <div className="text-4xl font-black text-emerald-600">Good</div>
          <p className="text-xs text-slate-500 font-semibold">Semester 6 In-Progress</p>
        </Card>
      </div>
    </div>
  );
};
