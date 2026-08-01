import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useEquipment } from '../../context/EquipmentContext';

export const ScheduleFormModal = ({ isOpen, onClose, onSubmit }) => {
  const { equipment } = useEquipment();

  const [formData, setFormData] = useState({
    equipmentId: equipment[0]?.id || '',
    maintenanceType: 'Preventive Maintenance',
    scheduledDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    assignedTo: 'Alex Turner',
    assignedToId: 'u-2',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.equipmentId) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Preventive Maintenance Schedule (FR-04)"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Target Equipment Asset *</label>
          <select
            name="equipmentId"
            value={formData.equipmentId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {equipment.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.name} ({eq.equipmentCode}) — {eq.department} [{eq.status}]
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Maintenance Type *</label>
            <select
              name="maintenanceType"
              value={formData.maintenanceType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Preventive Maintenance">Preventive Maintenance</option>
              <option value="Routine Check">Routine Check</option>
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Date *</label>
            <input
              type="date"
              name="scheduledDate"
              required
              value={formData.scheduledDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Maintenance Staff *</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  assignedTo: e.target.value,
                  assignedToId: 'u-2'
                }));
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Alex Turner">Alex Turner (Technical Support)</option>
              <option value="Campus Electrical Team">Campus Electrical Team</option>
              <option value="External Service Vendor">External Service Vendor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Maintenance Instructions & Notes</label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Specify maintenance scope, checklist items, or part requirements..."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
          >
            Schedule Maintenance
          </button>
        </div>
      </form>
    </Modal>
  );
};
