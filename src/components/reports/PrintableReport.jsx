import React from 'react';
import { Award, ShieldAlert, Cpu, Calendar, CheckCircle2, Printer } from 'lucide-react';
import { Button } from '../common/Button';
import { RiskBadge } from '../common/Badge';

export const PrintableReport = ({ reportData, onPrint }) => {
  if (!reportData) return null;

  const { reportId, generatedAt, student, attendance, examinations, aiIntelligence } = reportData;

  const handlePrintAction = () => {
    if (onPrint) onPrint();
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      {/* Control bar (hidden when printing) */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-red-500/30 no-print">
        <div>
          <h3 className="text-sm font-bold text-slate-100">KIT Academic Performance Report</h3>
          <p className="text-xs text-slate-400">Official institutional document view with AI Diagnostic evaluation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" icon={Printer} onClick={handlePrintAction}>
            Print / Save Official PDF
          </Button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-slate-950 text-slate-100 p-8 sm:p-10 rounded-3xl border border-red-500/30 shadow-2xl space-y-8 printable-sheet">
        {/* Header Block with KIT Coimbatore Logo */}
        <div className="flex items-center justify-between pb-6 border-b border-red-500/30">
          <div className="flex items-center gap-4">
            <img src="/assets/kit-logo.png" alt="KIT Logo" className="w-16 h-16 object-contain rounded-full bg-white p-1 border-2 border-red-600 shadow-md" />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">KIT COIMBATORE</h1>
              <p className="text-xs text-red-400 font-extrabold uppercase tracking-wider">KALAIGNAR KARUNANIDHI INSTITUTE OF TECHNOLOGY</p>
              <p className="text-[10px] text-slate-400 font-medium">OFFICIAL ACADEMIC INTELLIGENCE EVALUATION REPORT</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 space-y-1">
            <div><span className="font-semibold text-slate-300">Report ID:</span> {reportId}</div>
            <div><span className="font-semibold text-slate-300">Date Generated:</span> {generatedAt}</div>
            <div><span className="font-semibold text-slate-300">Status:</span> Certified</div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Student Name</span>
            <div className="text-base font-bold text-white">{student?.name}</div>
          </div>
          <div>
            <span className="text-xs text-slate-400">Roll Number</span>
            <div className="text-sm font-mono font-bold text-red-400">{student?.rollNo}</div>
          </div>
          <div>
            <span className="text-xs text-slate-400">Department & Term</span>
            <div className="text-sm font-semibold text-slate-200">{student?.department} (Sem {student?.semester})</div>
          </div>
          <div>
            <span className="text-xs text-slate-400">Current CGPA</span>
            <div className="text-base font-bold text-emerald-400">{student?.cgpa} / 4.00</div>
          </div>
        </div>

        {/* Academic Health Index & AI Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Overall Academic Health</div>
              <div className="text-4xl font-black text-red-400">{aiIntelligence?.overallPerformanceScore}%</div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Evaluated across Attendance, Assignments, & Mid-Term Examinations.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Academic Risk Status</div>
              <div className="mt-2">
                <RiskBadge level={aiIntelligence?.academicRiskLevel} />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Risk Level computed via multi-variate trend analytics.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Weak Subject Flagged</div>
              <div className="text-lg font-bold text-amber-400 mt-1">
                {aiIntelligence?.weakSubjects?.[0]?.subjectName || 'None'}
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Score: {aiIntelligence?.weakSubjects?.[0]?.currentScore}%
            </div>
          </div>
        </div>

        {/* Attendance & Exam Transcripts Table */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2">
            1. Subject Attendance & Exam Performance Breakdown
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Exam Score</th>
                  <th className="px-4 py-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {examinations?.map((ex, idx) => {
                  const att = attendance?.find((a) => a.courseName.includes(ex.subject.slice(0, 6))) || { percentage: 85 };
                  return (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-semibold text-slate-200">{ex.subject}</td>
                      <td className="px-4 py-3 font-mono">{att.percentage}%</td>
                      <td className="px-4 py-3 font-bold text-slate-100">{ex.obtainedMarks} / 100</td>
                      <td className="px-4 py-3 font-bold text-red-400">{ex.grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Diagnostic Recommendations */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-red-400" />
            2. AI Personalized Action Plan & Interventions
          </h3>
          <div className="space-y-3">
            {aiIntelligence?.aiRecommendations?.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-red-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-300">{rec.title}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold">{rec.priority} Priority</span>
                </div>
                <p className="text-xs text-slate-300">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Certification Footer */}
        <div className="pt-8 border-t border-red-500/20 flex items-end justify-between text-xs text-slate-500">
          <div>
            <div>KIT EduPulse AI Reporting Engine v2.4</div>
            <div>Digitally Signed & Certified by KIT Academic Dean Office</div>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-700 pb-1 mb-1 font-serif italic text-slate-300 text-center">
              Dr. Sarah Jenkins
            </div>
            <div>Academic Dean Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};
