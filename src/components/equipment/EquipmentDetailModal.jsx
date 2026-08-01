import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Clock, History, AlertTriangle, Cpu, MapPin, Calendar, Activity } from 'lucide-react';
import { useEquipment } from '../../context/EquipmentContext';

export const EquipmentDetailModal = ({ isOpen, onClose, equipmentItem }) => {
  const { schedules, issues, downtimeRecords } = useEquipment();

  if (!equipmentItem) return null;

  // Filter history items for this specific equipment
  const eqSchedules = schedules.filter(s => s.equipmentId === equipmentItem.id);
  const eqIssues = issues.filter(i => i.equipmentId === equipmentItem.id);
  const eqDowntime = downtimeRecords.filter(d => d.equipmentId === equipmentItem.id);

  const totalDowntimeHours = eqDowntime.reduce((sum, d) => sum + (d.durationHours || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Equipment Detail & Maintenance History - ${equipmentItem.equipmentCode}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header Specs Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" /> {equipmentItem.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{equipmentItem.modelNumber || 'Standard Model'}</p>
            </div>
            <StatusBadge status={equipmentItem.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Category</span>
              <span className="text-slate-200 font-medium">{equipmentItem.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Department</span>
              <span className="text-slate-200 font-medium">{equipmentItem.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Location</span>
              <span className="text-slate-200 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-400" /> {equipmentItem.location}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Purchase Date</span>
              <span className="text-slate-200 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> {equipmentItem.purchaseDate}
              </span>
            </div>
          </div>
        </div>

        {/* Downtime Statistics (FR-09) */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-rose-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Total Accumulated Downtime (FR-09)</div>
              <div className="text-[11px] text-slate-400">Calculated start/end outages for this asset</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-rose-400">{totalDowntimeHours.toFixed(1)} hrs</span>
            <div className="text-[10px] text-rose-300 font-medium">{eqDowntime.length} Downtime Log(s)</div>
          </div>
        </div>

        {/* Maintenance Schedules Timeline (FR-08) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" /> Service & Maintenance Schedule Log
          </h4>

          <div className="space-y-2">
            {eqSchedules.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 bg-slate-900/50 rounded-xl">
                No preventive maintenance tasks recorded for this equipment.
              </div>
            ) : (
              eqSchedules.map(sch => (
                <div key={sch.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{sch.maintenanceType}</span>
                      <PriorityBadge priority={sch.priority} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Assigned: {sch.assignedTo} • Scheduled: {sch.scheduledDate}</p>
                  </div>
                  <StatusBadge status={sch.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reported Incident History */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Reported Issues & Repairs Log
          </h4>

          <div className="space-y-2">
            {eqIssues.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 bg-slate-900/50 rounded-xl">
                No reported issues or repairs logged for this asset.
              </div>
            ) : (
              eqIssues.map(iss => (
                <div key={iss.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{iss.title}</span>
                    <StatusBadge status={iss.status} />
                  </div>
                  <p className="text-[11px] text-slate-400">{iss.description}</p>
                  {iss.resolutionRemarks && (
                    <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                      <span className="font-semibold">Resolution:</span> {iss.resolutionRemarks}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
