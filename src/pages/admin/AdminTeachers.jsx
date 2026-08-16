import React, { useState, useEffect } from 'react';
import { Users, UserPlus, BookOpen, Mail } from 'lucide-react';
import { apiService } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';

export const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminTeachers();
      setTeachers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Faculty Member',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
          <div>
            <div className="font-bold text-slate-100">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.designation}</div>
          </div>
        </div>
      ),
    },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Department', accessorKey: 'department' },
    {
      header: 'Assigned Courses',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.coursesAssigned.map((code) => (
            <span key={code} className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {code}
            </span>
          ))}
        </div>
      ),
    },
  ];

  if (loading) return <div className="py-12 text-center text-slate-400">Loading Faculty Roster...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Faculty Management</h1>
          <p className="text-xs text-slate-400">Professors, department assignments, and course allocations</p>
        </div>
      </div>

      <DataTable columns={columns} data={teachers} searchPlaceholder="Search faculty by name, department..." />
    </div>
  );
};
