import React from 'react';
import { AlertCircle, HelpCircle, BookOpen, ChevronRight } from 'lucide-react';

export const WeakSubjectCard = ({ subject }) => {
  if (!subject) return null;

  return (
    <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-4 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200 text-amber-700">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
              {subject.subjectCode}
            </span>
            <h4 className="text-base font-extrabold text-slate-900">{subject.subjectName}</h4>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-amber-700">{subject.currentScore}%</div>
          <div className="text-xs font-semibold text-slate-500">Current Exam Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="font-bold text-slate-800">WHY IS THIS HAPPENING?</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">{subject.reason}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span className="font-bold text-slate-800">CRITICAL TOPICS TO REVIEW</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-700 font-medium">
            {subject.criticalTopics?.map((topic, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-red-600" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
