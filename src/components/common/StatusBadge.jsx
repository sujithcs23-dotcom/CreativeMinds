import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      // Equipment Statuses
      case 'Operational':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Under Maintenance':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Reported':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Out of Service':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';

      // Maintenance Schedule Statuses
      case 'Upcoming':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Due Today':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/40 font-semibold';
      case 'Overdue':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold pulse-badge';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

      // Issue Statuses
      case 'Assigned':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'In Progress':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 font-medium';
      case 'Resolved':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'Closed':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';

      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
