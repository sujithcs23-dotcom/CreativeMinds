import React, { useState } from 'react';
import { CalendarClock, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export const ScheduleList = () => {
  const { schedules, updateScheduleStatus } = useEquipment();
  const [activeTabFilter, setActiveTabFilter] = useState('All');

  const filteredSchedules = schedules.filter(sch => {
    if (activeTabFilter === 'All') return true;
    return sch.status === activeTabFilter;
  });

  const getTabCount = (status) => {
    if (status === 'All') return schedules.length;
    return schedules.filter(s => s.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-indigo-400" /> Preventive Maintenance Schedule Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Preventive schedules are automatically generated upon registering equipment items. (FR-04, FR-05)
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Schedules configured automatically when adding equipment assets.</span>
        </div>
      </div>

      {/* Filter Tabs (FR-05) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-medium">
        {['All', 'Due Today', 'Overdue', 'Upcoming', 'Completed'].map(status => {
          const count = getTabCount(status);
          const isActive = activeTabFilter === status;
          return (
            <button
              key={status}
              onClick={() => setActiveTabFilter(status)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {status}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        {filteredSchedules.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 text-xs">
            <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            No maintenance schedules found under status "{activeTabFilter}".
          </div>
        ) : (
          filteredSchedules.map(sch => (
            <div
              key={sch.id}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {sch.equipmentCode}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm">{sch.equipmentName}</h3>
                  <StatusBadge status={sch.status} />
                  <PriorityBadge priority={sch.priority} />
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-indigo-400 font-semibold">{sch.maintenanceType}:</span> {sch.notes}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-medium">
                  <span>Assigned Tech: <strong className="text-slate-200">{sch.assignedTo}</strong></span>
                  <span>Scheduled Date: <strong className="text-slate-200">{sch.scheduledDate}</strong></span>
                  {sch.completedAt && (
                    <span className="text-emerald-400">Completed at: {new Date(sch.completedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 w-full md:w-auto justify-end">
                {sch.status !== 'Completed' && (
                  <>
                    {sch.status !== 'In Progress' && (
                      <button
                        onClick={() => updateScheduleStatus(sch.id, 'In Progress')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700 transition-all"
                      >
                        Start Work
                      </button>
                    )}
                    <button
                      onClick={() => updateScheduleStatus(sch.id, 'Completed', 'Maintenance performed as per schedule checklist.')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
