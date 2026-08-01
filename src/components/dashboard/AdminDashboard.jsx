import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle, 
  Plus, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export const AdminDashboard = ({ setActiveTab }) => {
  const { getDashboardStats, equipment, issues, schedules, downtimeRecords } = useEquipment();
  const stats = getDashboardStats();

  const recentIssues = issues.slice(0, 4);
  const urgentSchedules = schedules.filter(s => s.status === 'Due Today' || s.status === 'Overdue');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 glass-panel shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Campus Maintenance Command Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                System Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Overview of equipment assets, preventive schedules (configured on asset addition), issue pipeline, and outage downtime.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('equipment')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Equipment & Schedule
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
            >
              View Issues ({stats.openIssues})
            </button>
          </div>
        </div>
      </div>

      {/* FR-10 Key Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel glass-panel-hover border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Total Equipment</div>
            <div className="text-2xl font-black text-slate-100 mt-1">{stats.totalEquipment}</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> 100% Tracked
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 text-indigo-400 border border-slate-700/60">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel glass-panel-hover border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Operational Assets</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{stats.operational}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">
              {Math.round((stats.operational / stats.totalEquipment) * 100)}% Availability Rate
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel glass-panel-hover border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Under Maintenance</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{stats.underMaintenance + stats.reported}</div>
            <div className="text-[11px] text-amber-400 mt-1 font-medium">
              {stats.openIssues} Active Incident Reports
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel glass-panel-hover border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Total Downtime</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{stats.totalDowntimeHours} <span className="text-xs font-normal">hrs</span></div>
            <div className="text-[11px] text-rose-400 mt-1 font-medium">
              Across {downtimeRecords.length} incidents
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Overdue/Due Maintenance & Recent Reported Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-100 text-sm">Due & Overdue Maintenance</h3>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              View Schedule <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentSchedules.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
                No overdue or due-today maintenance schedules!
              </div>
            ) : (
              urgentSchedules.map(sch => (
                <div key={sch.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{sch.equipmentName}</span>
                      <StatusBadge status={sch.status} />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Assigned to: <span className="text-slate-300 font-medium">{sch.assignedTo}</span> • Scheduled: <span className="text-slate-300">{sch.scheduledDate}</span>
                    </div>
                  </div>
                  <PriorityBadge priority={sch.priority} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-slate-100 text-sm">Recent Reported Issues</h3>
            </div>
            <button
              onClick={() => setActiveTab('issues')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              All Issues <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentIssues.map(iss => (
              <div key={iss.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{iss.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{iss.equipmentName} • {iss.location}</p>
                  </div>
                  <StatusBadge status={iss.status} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Reported by: {iss.reportedBy}</span>
                  <PriorityBadge priority={iss.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
