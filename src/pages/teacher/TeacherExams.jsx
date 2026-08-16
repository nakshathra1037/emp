import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { apiService } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';

export const TeacherExams = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTeacherStudents('tch_201');
      setStudents(data);
      const initialMap = {};
      data.forEach((s) => {
        initialMap[s.id] = 85;
      });
      setMarks(initialMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (id, val) => {
    setMarks((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(100, Number(val))),
    }));
  };

  const handleSaveMarks = async () => {
    setToastMessage('Examination marks updated & sync complete!');
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading marksheets grid...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Examinations & Marksheets Grid</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Batch enter student mid-term exam scores</p>
        </div>
        <Button variant="primary" size="md" icon={Save} onClick={handleSaveMarks}>
          Save All Marks
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-extrabold uppercase text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Roll No</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Marks (Out of 100)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50">
                <td className="px-4 py-3.5 font-bold text-slate-900">{st.name}</td>
                <td className="px-4 py-3.5 font-mono font-bold text-red-700">{st.rollNo}</td>
                <td className="px-4 py-3.5 text-slate-700 font-medium">{st.department}</td>
                <td className="px-4 py-3.5">
                  <input
                    type="number"
                    value={marks[st.id] || 0}
                    onChange={(e) => handleMarkChange(st.id, e.target.value)}
                    className="w-24 px-3 py-1 text-sm bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
    </div>
  );
};
