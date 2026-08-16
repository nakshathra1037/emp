import React, { useState, useEffect } from 'react';
import { BookOpen, User, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';

export const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiService.getStudentDashboard('std_101');
      setCourses(res.courses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading courses...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Enrolled Courses</h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Active term course schedule and faculty allocations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((c) => (
          <Card key={c.id} className="space-y-4 bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                {c.code}
              </span>
              <span className="text-xs font-bold text-red-600">{c.credits} Credits</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">{c.name}</h3>
              <p className="text-xs text-slate-600 font-medium mt-1">{c.description}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" />
                <span>Instructor: {c.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Schedule: {c.schedule}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
