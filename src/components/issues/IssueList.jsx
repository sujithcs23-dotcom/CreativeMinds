import React, { useState } from 'react';
import { AlertTriangle, Plus, CheckCircle, UserCheck, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ReportIssueModal } from './ReportIssueModal';
import { Modal } from '../common/Modal';

export const IssueList = () => {
  const { issues, updateIssueStatus } = useEquipment();
  const { currentUser } = useAuth();

  const [activeFilter, setActiveFilter] = useState('All');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Resolution modal state
  const [resolvingIssue, setResolvingIssue] = useState(null);
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  // Assign modal state
  const [assigningIssue, setAssigningIssue] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('Alex Turner');

  const filteredIssues = issues.filter(iss => {
    if (activeFilter === 'All') return true;
    return iss.status === activeFilter;
  });

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolvingIssue) return;
    updateIssueStatus(resolvingIssue.id, 'Resolved', null, resolutionRemarks);
    setResolvingIssue(null);
    setResolutionRemarks('');
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assigningIssue) return;
    updateIssueStatus(assigningIssue.id, 'Assigned', { id: 'u-2', name: selectedStaff }, '');
    setAssigningIssue(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" /> Equipment Issue & Repair Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track reported issues through lifecycle: Reported → Assigned → In Progress → Resolved → Closed. (FR-07)
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Report New Equipment Issue
        </button>
      </div>

      {/* Workflow Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-medium">
        {['All', 'Reported', 'Assigned', 'In Progress', 'Resolved'].map(status => {
          const count = status === 'All' ? issues.length : issues.filter(i => i.status === status).length;
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
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

      {/* Issues Pipeline Cards */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 text-xs">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            No reported issues found in stage "{activeFilter}".
          </div>
        ) : (
          filteredIssues.map(issue => (
            <div key={issue.id} className="glass-panel glass-panel-hover p-5 rounded-2xl border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {issue.equipmentCode}
                    </span>
                    <h3 className="font-bold text-slate-100 text-base">{issue.title}</h3>
                    <PriorityBadge priority={issue.priority} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Equipment: <strong className="text-slate-200">{issue.equipmentName}</strong> • Location: <strong className="text-slate-200">{issue.location}</strong>
                  </p>
                </div>
                <StatusBadge status={issue.status} />
              </div>

              {/* Description & Image attachment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Issue Details:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>
                </div>
                {issue.imageUrl && (
                  <div className="flex flex-col items-center justify-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <img src={issue.imageUrl} alt="Issue Attachment" className="w-full h-24 object-cover rounded" />
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Photo Evidence Attached
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Steps (FR-07 Workflow) */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Lifecycle Stage:</span>
                  <span>Assigned Tech Staff: <strong className="text-indigo-300">{issue.assignedTo}</strong></span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center font-semibold">
                  <div className={`p-1.5 rounded-lg border ${
                    ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'].includes(issue.status)
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}>
                    1. Reported
                  </div>
                  <div className={`p-1.5 rounded-lg border ${
                    ['Assigned', 'In Progress', 'Resolved', 'Closed'].includes(issue.status)
                      ? 'bg-sky-600/30 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}>
                    2. Assigned
                  </div>
                  <div className={`p-1.5 rounded-lg border ${
                    ['In Progress', 'Resolved', 'Closed'].includes(issue.status)
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}>
                    3. In Progress
                  </div>
                  <div className={`p-1.5 rounded-lg border ${
                    ['Resolved', 'Closed'].includes(issue.status)
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}>
                    4. Resolved
                  </div>
                  <div className={`p-1.5 rounded-lg border ${
                    ['Closed'].includes(issue.status)
                      ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}>
                    5. Closed
                  </div>
                </div>
              </div>

              {issue.resolutionRemarks && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <span className="font-bold">Resolution Remarks:</span> {issue.resolutionRemarks}
                </div>
              )}

              {/* Workflow Actions Footer */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Reported by: <strong className="text-slate-200">{issue.reportedBy}</strong></span>
                <div className="flex items-center gap-2">
                  {currentUser.role === 'admin' && issue.status === 'Reported' && (
                    <button
                      onClick={() => setAssigningIssue(issue)}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Assign Staff
                    </button>
                  )}

                  {(currentUser.role === 'staff' || currentUser.role === 'admin') && issue.status === 'Assigned' && (
                    <button
                      onClick={() => updateIssueStatus(issue.id, 'In Progress')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {(currentUser.role === 'staff' || currentUser.role === 'admin') && (issue.status === 'In Progress' || issue.status === 'Assigned') && (
                    <button
                      onClick={() => {
                        setResolvingIssue(issue);
                        setResolutionRemarks('');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Resolve & End Downtime
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Assign Staff Modal */}
      <Modal
        isOpen={!!assigningIssue}
        onClose={() => setAssigningIssue(null)}
        title="Assign Issue to Maintenance Staff"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <p className="text-xs text-slate-300">
            Assigning tech staff for issue: <strong className="text-indigo-400">{assigningIssue?.title}</strong>
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Staff Member *</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Alex Turner">Alex Turner (Technical Support & Repair)</option>
              <option value="Campus Electrical Specialist">Campus Electrical Specialist</option>
              <option value="HVAC Vendor Specialist">HVAC Vendor Specialist</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setAssigningIssue(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Resolve Issue Modal */}
      <Modal
        isOpen={!!resolvingIssue}
        onClose={() => setResolvingIssue(null)}
        title="Resolve Issue & Calculate Equipment Downtime"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            Resolving this issue will automatically update the equipment status back to <strong className="underline">Operational</strong> and finalize the calculated downtime duration.
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution Remarks & Repairs Done *</label>
            <textarea
              rows="3"
              required
              placeholder="Detail work performed, parts replaced, and verification testing results..."
              value={resolutionRemarks}
              onChange={(e) => setResolutionRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setResolvingIssue(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30"
            >
              Mark Issue Resolved
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
