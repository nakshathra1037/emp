import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';

export const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiService.getTeacherDashboard('tch_201');
      setCourses(res.assignedCourses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading assigned courses...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Assigned Courses & Classes</h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Faculty teaching workload & section allocations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((c) => (
          <Card key={c.id} className="space-y-4 bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                {c.code}
              </span>
              <span className="text-xs font-bold text-red-600">Section {c.section}</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">{c.name}</h3>
              <p className="text-xs text-slate-600 font-medium mt-1">Department of Computer Science & Engineering</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                <span>Enrolled Students: {c.studentsCount} Students</span>
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
