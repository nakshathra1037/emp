import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Clock, Users } from 'lucide-react';
import { apiService } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminCourses();
      setCourses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Course Code & Name',
      cell: (row) => (
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 mr-2">
            {row.code}
          </span>
          <span className="font-bold text-slate-100">{row.name}</span>
        </div>
      ),
    },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Credits', cell: (row) => <span className="font-bold text-emerald-400">{row.credits} Credits</span> },
    { header: 'Instructor', accessorKey: 'instructor' },
    { header: 'Enrolled', cell: (row) => <span>{row.enrolledCount} / {row.maxCapacity}</span> },
  ];

  if (loading) return <div className="py-12 text-center text-slate-400">Loading course catalog...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Course Catalog & Allocation</h1>
          <p className="text-xs text-slate-400">Manage university curriculum, course codes, credits, and capacity caps</p>
        </div>
      </div>

      <DataTable columns={columns} data={courses} searchPlaceholder="Search courses by code or title..." />
    </div>
  );
};
