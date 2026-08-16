export const themeColors = {
  primary: '#dc2626', // Red 600
  primaryHover: '#b91c1c', // Red 700
  aiPurple: '#e11d48', // Rose 600
  aiCyan: '#ea580c', // Orange 600
  success: '#10b981',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#2563eb',
  
  risk: {
    low: { label: 'Low Risk', color: '#10b981', bg: '#ecfdf5', text: '#047857' },
    medium: { label: 'Medium Risk', color: '#f59e0b', bg: '#fffbeb', text: '#b45309' },
    high: { label: 'High Risk', color: '#ea580c', bg: '#fff7ed', text: '#c2410c' },
    critical: { label: 'Critical Risk', color: '#dc2626', bg: '#fef2f2', text: '#b91c1c' },
  },

  chartGrid: '#f1f5f9',
  chartTooltipBg: '#ffffff',
  chartTooltipBorder: '#cbd5e1',
};

export const getRiskMeta = (level) => {
  const normalized = (level || 'low').toLowerCase();
  return themeColors.risk[normalized] || themeColors.risk.low;
};
