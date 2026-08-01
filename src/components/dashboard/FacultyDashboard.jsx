import React from 'react';
import { PlusCircle, ClipboardList, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export const FacultyDashboard = ({ setActiveTab, onOpenReportModal }) => {
  const { issues, equipment } = useEquipment();

  // Filter issues reported by Dr. Sarah Jenkins (Faculty user)
  const myIssues = issues.filter(i => i.reportedBy === 'Dr. Sarah Jenkins' || i.reportedById === 'u-3');

  const resolvedCount = myIssues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
  const inProgressCount = myIssues.filter(i => i.status === 'Assigned' || i.status === 'In Progress').length;
  const reportedCount = myIssues.filter(i => i.status === 'Reported').length;

  return (
    <div className="space-y-6">
      {/* Faculty Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 glass-panel shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Faculty & Department Support Portal
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Dr. Sarah Jenkins (CS Dept)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Report equipment malfunctions, request technical repairs, and monitor resolution timelines in real-time.
            </p>
          </div>
          <button
            onClick={onOpenReportModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Report New Equipment Issue
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">My Reported Issues</div>
            <div className="text-2xl font-black text-slate-100 mt-1">{myIssues.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Total tickets filed</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">In Maintenance Pipeline</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{inProgressCount + reportedCount}</div>
            <div className="text-[11px] text-amber-400 mt-0.5 font-medium">{reportedCount} Pending Staff Assignment</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Successfully Resolved</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{resolvedCount}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">Equipment restored to operational</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Reported Issues Timeline */}
      <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-400" /> My Reported Issues & Resolution Status
          </h3>
          <button
            onClick={() => setActiveTab('my-issues')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            Full Issue History <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {myIssues.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No issues reported yet. Click "Report New Equipment Issue" to file a ticket.
            </div>
          ) : (
            myIssues.map(issue => (
              <div key={issue.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {issue.title}
                      <PriorityBadge priority={issue.priority} />
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {issue.equipmentName} ({issue.equipmentCode}) • {issue.location}
                    </p>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>

                {/* Progress bar steps */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] text-slate-400 flex justify-between font-medium">
                    <span>Workflow Progress:</span>
                    <span className="text-indigo-400">Assigned Staff: {issue.assignedTo}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                    <div className={`p-1.5 rounded-lg border font-semibold ${
                      ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'].includes(issue.status)
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      1. Reported
                    </div>
                    <div className={`p-1.5 rounded-lg border font-semibold ${
                      ['Assigned', 'In Progress', 'Resolved', 'Closed'].includes(issue.status)
                        ? 'bg-sky-600/30 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      2. Assigned
                    </div>
                    <div className={`p-1.5 rounded-lg border font-semibold ${
                      ['In Progress', 'Resolved', 'Closed'].includes(issue.status)
                        ? 'bg-amber-600/30 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      3. In Repair
                    </div>
                    <div className={`p-1.5 rounded-lg border font-semibold ${
                      ['Resolved', 'Closed'].includes(issue.status)
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      4. Resolved
                    </div>
                  </div>
                </div>

                {issue.resolutionRemarks && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    <span className="font-semibold">Staff Resolution Note:</span> {issue.resolutionRemarks}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
