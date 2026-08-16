import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { RiskBadge } from '../../components/common/Badge';

export const TeacherAIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const res = await apiService.getTeacherAIInsights('tch_201');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading Teacher AI Diagnostics...</div>;

  const { classAverageScore, atRiskCount, weakSubjectClusters, interventionRecommendations, studentAttentionList } = data;

  return (
    <div className="space-y-8 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Faculty AI Diagnostics & Risk Matrix</h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Automated class performance scanning & student intervention advisory</p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-2 bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Average Mark</span>
          <div className="text-3xl font-black text-slate-900">{classAverageScore}%</div>
          <p className="text-xs text-slate-500 font-semibold">Across CS-301 & CS-305</p>
        </Card>

        <Card className="space-y-2 bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students Flagged At-Risk</span>
          <div className="text-3xl font-black text-amber-600">{atRiskCount}</div>
          <p className="text-xs text-slate-500 font-semibold">Requires faculty intervention</p>
        </Card>

        <Card className="space-y-2 bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Weak Topic</span>
          <div className="text-xl font-black text-red-600 truncate">{weakSubjectClusters[0]?.topic}</div>
          <p className="text-xs text-slate-500 font-semibold">{weakSubjectClusters[0]?.percentage}% of students struggling</p>
        </Card>
      </div>

      {/* Student Attention Roster */}
      <Card title="Students Requiring Immediate Faculty Attention" subtitle="Flagged by low attendance and exam performance drop">
        <div className="space-y-3">
          {studentAttentionList?.map((st) => (
            <div key={st.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{st.name}</span>
                  <span className="font-mono text-slate-500 font-bold">({st.rollNo})</span>
                  <RiskBadge level={st.riskLevel} />
                </div>
                <p className="text-slate-700 font-semibold">
                  Weak Topic: <strong className="text-red-700 font-bold">{st.weakSubject}</strong> • Attendance: {st.attendance}% • Exam Score: {st.examScore}%
                </p>
              </div>
              <div className="text-slate-600 font-medium italic max-w-md">
                "{st.aiRecommendation}"
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
