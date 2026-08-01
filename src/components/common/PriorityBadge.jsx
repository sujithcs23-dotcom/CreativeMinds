import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold';
      case 'Medium':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'Low':
      default:
        return 'bg-slate-700/40 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getStyle()}`}>
      {priority} Priority
    </span>
  );
};
