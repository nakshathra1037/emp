import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { RiskBadge } from '../../components/common/Badge';
import { AIWorkflowVisualizer } from '../../components/ai/AIWorkflowVisualizer';
import { WeakSubjectCard } from '../../components/ai/WeakSubjectCard';
import { themeColors } from '../../styles/theme';

export const StudentAIIntelligence = () => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIIntelligence();
  }, []);

  const fetchAIIntelligence = async () => {
    setLoading(true);
    try {
      const res = await apiService.getStudentAIIntelligence('std_101');
      setAiData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-500 font-medium">Loading AI Intelligence Engine...</div>;

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">AI Academic Intelligence Suite</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              Pseudo Map Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Integrated diagnostic analytics mapping Attendance + Assignments + Exam Marks $\rightarrow$ Risk & Recommendations
          </p>
        </div>
      </div>

      {/* AI Pipeline Flow Banner */}
      <AIWorkflowVisualizer />

      {/* 3 Core Questions UI: WHAT, WHY, WHAT TO IMPROVE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* QUESTION 1: WHAT IS HAPPENING? */}
        <Card aiGlow title="1. WHAT is happening?" subtitle="Core Academic Metrics Summary">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 text-center">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Overall Academic Health</span>
              <div className="text-4xl font-black text-red-600 mt-1">{aiData.overallPerformanceScore}%</div>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Attendance Meter</span>
                <span className="font-bold text-slate-900">{aiData.metrics.attendancePct}%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Assignment Average</span>
                <span className="font-bold text-slate-900">{aiData.metrics.assignmentAvg}%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Examination Average</span>
                <span className="font-bold text-slate-900">{aiData.metrics.examAvg}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">Computed Risk:</span>
              <RiskBadge level={aiData.academicRiskLevel} />
            </div>
          </div>
        </Card>

        {/* QUESTION 2: WHY IS IT HAPPENING? */}
        <div className="md:col-span-2">
          <Card title="2. WHY is it happening?" subtitle="Weak Subject Identification & Root Cause Diagnostic">
            <div className="space-y-4">
              {aiData.weakSubjects?.map((subject, idx) => (
                <WeakSubjectCard key={idx} subject={subject} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* QUESTION 3: WHAT SHOULD THE STUDENT IMPROVE? */}
      <Card aiGlow title="3. WHAT should you improve?" subtitle="AI Personalized Step-by-Step Recommendations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiData.aiRecommendations?.map((rec) => (
            <div key={rec.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded font-bold bg-red-100 text-red-700 border border-red-200">
                    {rec.category}
                  </span>
                  <span className="font-mono text-amber-700 font-bold">{rec.priority} Priority</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{rec.description}</p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actionable Steps:</span>
                <ul className="space-y-1 text-xs text-slate-700 font-medium">
                  {rec.actionableSteps?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* PERFORMANCE TRENDS CHART */}
      <Card title="Performance Trend Analytics" subtitle="5-Month trajectory across Attendance, Assignments, & Exams">
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aiData.performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis domain={[40, 100]} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.chartTooltipBg,
                  borderColor: themeColors.chartTooltipBorder,
                  borderRadius: '12px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                }}
              />
              <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="assignments" name="Assignments %" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="exams" name="Exam Scores %" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
