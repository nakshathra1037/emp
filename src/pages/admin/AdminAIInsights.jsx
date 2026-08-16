import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { RiskBadge } from '../../components/common/Badge';

export const AdminAIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAdminDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading Campus AI Risk Matrix...</div>;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white">Campus Institutional AI Risk Matrix</h1>
          <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            Institutional AI
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Predictive drop-out alerts, department weak spots, and early academic intervention matrix
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card aiGlow title="Critical & High Risk Roster" subtitle="Immediate institutional intervention required">
          <div className="space-y-3">
            {data.atRiskStudentsList?.map((st) => (
              <div key={st.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{st.name}</span>
                    <span className="text-xs font-mono text-slate-400">({st.rollNo})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dept: {st.department} • Weak Subject: <strong className="text-amber-400">{st.weakSubject}</strong>
                  </p>
                </div>
                <RiskBadge level={st.riskLevel} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Department Weak Area Diagnostic Heatmap">
          <div className="space-y-3">
            {data.departmentPerformance?.map((dept, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-100">
                  <span>{dept.department}</span>
                  <span className={dept.riskCount > 20 ? 'text-rose-400' : 'text-amber-400'}>
                    {dept.riskCount} At-Risk Students
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${dept.avgScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${dept.avgScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Average GPA Score: {dept.avgScore}%</span>
                  <span>Attendance: {dept.attendanceAvg}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
