import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { apiService } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { RiskBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    department: 'Computer Science',
    semester: 6,
    cgpa: 3.5,
    academicRisk: 'Low',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
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

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      rollNo: `2026-CS-${Math.floor(100 + Math.random() * 900)}`,
      email: '',
      department: 'Computer Science',
      semester: 6,
      cgpa: 3.5,
      academicRisk: 'Low',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStudent(st);
    setFormData(st);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteStudent(id);
      setToastMessage('Student record removed successfully.');
      fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await apiService.updateStudent(editingStudent.id, formData);
        setToastMessage('Student details updated successfully!');
      } else {
        await apiService.createStudent(formData);
        setToastMessage('New student created successfully!');
      }
      setModalOpen(false);
      fetchStudents();
    } catch (e) {
      console.error(e);
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
    { header: 'Email', accessorKey: 'email' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Semester', accessorKey: 'semester', cell: (row) => <span className="font-bold">Sem {row.semester}</span> },
    { header: 'CGPA', accessorKey: 'cgpa', cell: (row) => <span className="font-bold text-emerald-700">{row.cgpa}</span> },
    {
      header: 'Risk Level',
      accessorKey: 'academicRisk',
      cell: (row) => <RiskBadge level={row.academicRisk} />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading student directory...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Directory Management</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Full CRUD control over institutional student records</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
          Add New Student
        </Button>
      </div>

      <DataTable columns={columns} data={students} searchPlaceholder="Search student by name, email, or roll no..." />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingStudent ? 'Edit Student Details' : 'Add New Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
              <input
                type="number"
                min={1}
                max={8}
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingStudent ? 'Update Record' : 'Create Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
    </div>
  );
};
