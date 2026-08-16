import React from 'react';
import { Cpu, CheckCircle2, Activity, AlertTriangle, Lightbulb } from 'lucide-react';

export const AIWorkflowVisualizer = () => {
  const steps = [
    {
      stepNo: '01',
      title: 'Inputs',
      icon: Activity,
      color: 'bg-red-600 text-white',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      items: ['Attendance (72%)', 'Assignment Scores (81%)', 'Exam Marks (58%)'],
    },
    {
      stepNo: '02',
      title: 'AI Engine Process',
      icon: Cpu,
      color: 'bg-rose-600 text-white',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      items: ['Diagnostic Processing', 'Trend Pattern Extraction', 'Risk Matrix Computation'],
    },
    {
      stepNo: '03',
      title: 'Diagnostics',
      icon: AlertTriangle,
      color: 'bg-amber-600 text-white',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      items: ['Weak Subject: MATH-202', 'Risk Level: Medium Risk', 'Attendance Alert < 75%'],
    },
    {
      stepNo: '04',
      title: 'Action & Insights',
      icon: Lightbulb,
      color: 'bg-emerald-600 text-white',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      items: ['Personalized Study Plan', 'Teacher Intervention Advisory', 'Printable Report'],
    },
  ];

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100 shadow-xs">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Academic Intelligence Pipeline Flow</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                Pseudo Map Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Automated multi-variate diagnostic scanning of student academic records</p>
          </div>
        </div>
      </div>

      {/* 4 Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${step.badgeColor}`}>
                    STEP {step.stepNo}
                  </span>
                  <div className={`p-2 rounded-xl ${step.color} shadow-xs`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-base font-black text-slate-900">{step.title}</h4>

                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {step.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
