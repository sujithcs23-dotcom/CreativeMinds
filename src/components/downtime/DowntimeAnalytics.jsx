import React from 'react';
import { Activity, Clock, AlertTriangle, Cpu, TrendingDown, RefreshCw } from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';

export const DowntimeAnalytics = () => {
  const { downtimeRecords, equipment } = useEquipment();

  const totalDowntimeHours = downtimeRecords.reduce((sum, d) => sum + (d.durationHours || 0), 0);
  const activeOutages = downtimeRecords.filter(d => !d.endTime);

  const formatHours = (hrs) => {
    if (!hrs) return '0 hrs';
    if (hrs >= 24) {
      const days = (hrs / 24).toFixed(1);
      return `${hrs.toFixed(1)} hrs (${days} days)`;
    }
    return `${hrs.toFixed(1)} hrs`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-6 h-6 text-rose-400" /> Equipment Downtime & Outage Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Track downtime start/end times and total accumulated equipment unavailability. (FR-09)
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total System Downtime</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{formatHours(totalDowntimeHours)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across {downtimeRecords.length} recorded outages</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Active Unresolved Outages</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{activeOutages.length}</div>
            <div className="text-[11px] text-amber-400 mt-0.5 font-medium">Currently accruing downtime</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-6 h-6 animate-spin" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Average Outage Duration</div>
            <div className="text-2xl font-black text-indigo-400 mt-1">
              {downtimeRecords.length > 0 ? (totalDowntimeHours / downtimeRecords.length).toFixed(1) : 0} <span className="text-xs font-normal">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Mean Time To Repair (MTTR)</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Downtime Records Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Outage Downtime History Log
          </h3>
          <span className="text-xs text-slate-400">FR-09 Calculation Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Equipment Tag & Name</th>
                <th className="p-4">Outage Start Time</th>
                <th className="p-4">Outage End Time</th>
                <th className="p-4">Calculated Downtime</th>
                <th className="p-4">Reason / Root Cause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {downtimeRecords.map(dt => (
                <tr key={dt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-100">
                    <div>{dt.equipmentName}</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{dt.equipmentCode}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-mono text-[11px]">
                    {new Date(dt.startTime).toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-[11px]">
                    {dt.endTime ? (
                      <span className="text-emerald-400">{new Date(dt.endTime).toLocaleString()}</span>
                    ) : (
                      <span className="text-amber-400 font-bold animate-pulse">Ongoing Outage...</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold font-mono">
                      {dt.durationHours ? `${dt.durationHours} hrs` : 'Calculating...'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 max-w-xs leading-relaxed">
                    {dt.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
