import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  glow = false,
  aiGlow = false,
  className = '',
  bodyClassName = '',
  ...props
}) => {
  return (
    <div
      className={`glass-panel glass-panel-hover p-6 relative overflow-hidden bg-white ${
        aiGlow ? 'ai-card-glow border-red-200' : 'border-slate-200'
      } ${glow ? 'shadow-lg shadow-red-500/5' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};
