import React from 'react';
import { Wrench, CalendarClock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export const StaffDashboard = ({ setActiveTab }) => {
  const { schedules, issues, updateScheduleStatus, updateIssueStatus } = useEquipment();

  // Filter tasks assigned to Alex Turner (Staff user)
  const myTasks = schedules.filter(s => s.assignedTo === 'Alex Turner' || s.assignedToId === 'u-2');
  const myIssues = issues.filter(i => i.assignedTo === 'Alex Turner' || i.assignedToId === 'u-2');

  const pendingTasksCount = myTasks.filter(t => t.status !== 'Completed').length;
  const activeIssuesCount = myIssues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Staff Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/20 glass-panel shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Maintenance Staff Work Desk
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Alex Turner (Tech Support)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              You have <span className="text-amber-400 font-bold">{pendingTasksCount} preventive tasks</span> and <span className="text-rose-400 font-bold">{activeIssuesCount} assigned repairs</span> requiring work.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('assigned-tasks')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg transition-all flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Manage My Tasks
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Assigned Maintenance Tasks</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{myTasks.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{pendingTasksCount} Pending Completion</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <CalendarClock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Assigned Repair Issues</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{myIssues.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{activeIssuesCount} In Progress / Assigned</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Completed Repairs Today</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">1</div>
            <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">100% Quality Verified</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Assigned Tasks & Issues Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Tasks */}
        <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-amber-400" /> Pending Preventive Schedules
            </h3>
            <button
              onClick={() => setActiveTab('assigned-tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {myTasks.filter(t => t.status !== 'Completed').map(task => (
              <div key={task.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{task.equipmentName}</h4>
                    <p className="text-[11px] text-slate-400">{task.maintenanceType} • Scheduled: {task.scheduledDate}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {task.notes}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <PriorityBadge priority={task.priority} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateScheduleStatus(task.id, 'In Progress')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-medium border border-indigo-500/40 transition-colors"
                    >
                      Start Work
                    </button>
                    <button
                      onClick={() => updateScheduleStatus(task.id, 'Completed', 'Maintenance performed and tested operational.')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-medium border border-emerald-500/40 transition-colors"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Issues */}
        <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Assigned Repair Workorders
            </h3>
            <button
              onClick={() => setActiveTab('assigned-issues')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {myIssues.map(issue => (
              <div key={issue.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{issue.title}</h4>
                    <p className="text-[11px] text-slate-400">{issue.equipmentName} • {issue.location}</p>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {issue.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Reporter: {issue.reportedBy}</span>
                  {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
                    <button
                      onClick={() => updateIssueStatus(issue.id, 'Resolved', null, 'Replaced component and verified normal operation.')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      Resolve & Close Downtime
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
