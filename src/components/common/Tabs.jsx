import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className="flex border-b border-slate-200 space-x-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                isActive ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
