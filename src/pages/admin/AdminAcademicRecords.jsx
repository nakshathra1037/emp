import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Search, Award } from 'lucide-react';
import { apiService } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { RiskBadge } from '../../components/common/Badge';

export const AdminAcademicRecords = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminStudents();
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
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-100">{row.name}</div>
          <div className="text-[11px] font-mono text-slate-400">{row.rollNo}</div>
        </div>
      ),
    },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Semester', accessorKey: 'semester' },
    { header: 'CGPA', cell: (row) => <span className="font-bold text-indigo-400">{row.cgpa}</span> },
    { header: 'Weak Subject', accessorKey: 'weakSubject' },
    { header: 'Risk Classification', cell: (row) => <RiskBadge level={row.academicRisk} /> },
  ];

  if (loading) return <div className="py-12 text-center text-slate-400">Loading Academic Transcripts...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Institutional Academic Records</h1>
        <p className="text-xs text-slate-400">Consolidated grade transcripts and student evaluation metrics</p>
      </div>

      <DataTable columns={columns} data={students} searchPlaceholder="Search academic records..." />
    </div>
  );
};
