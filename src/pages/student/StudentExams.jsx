import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';

export const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudentExams('std_101');
      setExams(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading examinations data...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Examinations & Marksheets</h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Mid-term, end-term, and laboratory evaluation records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((ex) => (
          <Card key={ex.id} className="space-y-4 bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                {ex.examType}
              </span>
              <span className="text-xs font-semibold text-slate-500">{ex.date}</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">{ex.subject}</h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Class Average: {ex.classAverage}%</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">Obtained Score</span>
                <div className="text-xl font-black text-slate-900">{ex.obtainedMarks} / {ex.maxMarks}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500">Letter Grade</span>
                <div className="text-xl font-black text-red-600">{ex.grade}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
