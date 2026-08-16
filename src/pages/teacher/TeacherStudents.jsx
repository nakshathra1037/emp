import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { RiskBadge } from '../../components/common/Badge';

export const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTeacherStudents('tch_201');
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Student Name',
      accessorKey: 'name',
      cell: (row) => <span className="font-extrabold text-slate-900">{row.name}</span>,
    },
    {
      header: 'Roll No',
      accessorKey: 'rollNo',
      cell: (row) => <span className="font-mono font-bold text-red-700">{row.rollNo}</span>,
    },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Attendance %', accessorKey: 'attendance', cell: (row) => <span className="font-bold">{row.attendance}%</span> },
    { header: 'CGPA', accessorKey: 'cgpa', cell: (row) => <span className="font-bold text-emerald-700">{row.cgpa}</span> },
    {
      header: 'AI Risk Status',
      accessorKey: 'riskLevel',
      cell: (row) => <RiskBadge level={row.riskLevel} />,
    },
  ];

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading student roster...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Enrolled Students Roster</h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Faculty view of enrolled student metrics & AI diagnostic risk</p>
      </div>

      <DataTable columns={columns} data={students} searchPlaceholder="Search student by name or roll number..." />
    </div>
  );
};
