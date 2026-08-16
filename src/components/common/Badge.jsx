import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon, Info } from 'lucide-react';
import { getRiskMeta } from '../../styles/theme';

export const RiskBadge = ({ level = 'low', showIcon = true, className = '' }) => {
  const meta = getRiskMeta(level);
  
  const icons = {
    low: ShieldCheck,
    medium: Info,
    high: AlertTriangle,
    critical: AlertOctagon,
  };
  
  const Icon = icons[(level || 'low').toLowerCase()] || Info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm ${className}`}
      style={{
        backgroundColor: meta.bg,
        color: meta.text,
        borderColor: `${meta.color}35`,
      }}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" style={{ color: meta.text }} />}
      {meta.label}
    </span>
  );
};

export const StatusBadge = ({ status = 'Active', className = '' }) => {
  const statusStyles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'At Risk': 'bg-rose-50 text-rose-700 border-rose-200',
    Graded: 'bg-red-50 text-red-700 border-red-200',
    Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    Pending: 'bg-slate-100 text-slate-600 border-slate-200',
    Good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Warning: 'bg-amber-50 text-amber-700 border-amber-200',
    Excellent: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const style = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${style} ${className}`}>
      {status}
    </span>
  );
};
