import React, { useState, useEffect } from 'react';
import { Calendar, Save, CheckCircle2, XCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';

export const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('CS-301');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTeacherStudents('tch_201');
      setStudents(data);
      const initialMap = {};
      data.forEach((s) => {
        initialMap[s.id] = 'Present';
      });
      setAttendanceState(initialMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id) => {
    setAttendanceState((prev) => ({
      ...prev,
      [id]: prev[id] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      const records = Object.entries(attendanceState).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      await apiService.recordAttendance(selectedCourse, attendanceDate, records);
      setToastMessage(`Attendance for ${selectedCourse} saved successfully for ${attendanceDate}!`);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading student roster...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Interactive Attendance Recorder</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Record lecture turnout for assigned course sections</p>
        </div>
        <Button variant="primary" size="md" icon={Save} onClick={handleSaveAttendance}>
          Save Attendance Sheet
        </Button>
      </div>

      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Course Section:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs font-bold"
          >
            <option value="CS-301">CS-301 Advanced Algorithms</option>
            <option value="CS-305">CS-305 Machine Learning</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Date:</span>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="text-xs font-bold"
          />
        </div>
      </div>

      <div className="space-y-3">
        {students.map((st) => {
          const isPresent = attendanceState[st.id] === 'Present';
          return (
            <div
              key={st.id}
              onClick={() => toggleStatus(st.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isPresent
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                  : 'bg-rose-50/60 border-rose-200 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {isPresent ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{st.name}</h4>
                  <p className="text-xs text-slate-600 font-semibold">Roll No: {st.rollNo} • {st.department}</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {attendanceState[st.id]}
              </span>
            </div>
          );
        })}
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
    </div>
  );
};
