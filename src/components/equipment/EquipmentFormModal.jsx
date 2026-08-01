import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { CalendarClock, Cpu, ShieldCheck } from 'lucide-react';

export const EquipmentFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    equipmentCode: '',
    category: 'Computers',
    department: 'Computer Science',
    location: '',
    modelNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'Operational',
    
    // Automatic Preventive Maintenance Schedule Fields (Required on Registration)
    maintenanceType: 'Preventive Maintenance',
    scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days out
    priority: 'Medium',
    assignedTo: 'Alex Turner',
    assignedToId: 'u-2',
    maintenanceNotes: 'Initial post-registration preventive checkup and performance calibration.'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    } else {
      setFormData({
        name: '',
        equipmentCode: '',
        category: 'Computers',
        department: 'Computer Science',
        location: '',
        modelNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        status: 'Operational',
        maintenanceType: 'Preventive Maintenance',
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'Medium',
        assignedTo: 'Alex Turner',
        assignedToId: 'u-2',
        maintenanceNotes: 'Initial post-registration preventive checkup and performance calibration.'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.scheduledDate) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Equipment Register' : 'Register Equipment & Schedule Preventive Maintenance'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Equipment Specifications Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              1. Equipment Specifications & Location
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Equipment Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. 4K Laser Projector"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Code / Tag</label>
              <input
                type="text"
                name="equipmentCode"
                value={formData.equipmentCode}
                onChange={handleChange}
                placeholder="Auto-generated if empty (e.g. EQ-CS-008)"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Computers">Computers</option>
                <option value="Projectors">Projectors</option>
                <option value="Printers">Printers</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Electrical">Electrical</option>
                <option value="AC">Air Conditioner (AC)</option>
                <option value="Network">Network Devices</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics & Comm.</option>
                <option value="Mechanical">Mechanical Eng.</option>
                <option value="Administration">Administration</option>
                <option value="Library">Central Library</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Room *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Lab 101, Block B"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Model / Serial Number</label>
              <input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                placeholder="e.g. Cisco Catalyst 9300"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Integrated Maintenance Scheduling Section */}
        {!initialData && (
          <div className="space-y-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
              <CalendarClock className="w-4 h-4 text-indigo-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                2. Preventive Maintenance Schedule (Configured Upon Addition)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Schedule Type *</label>
                <select
                  name="maintenanceType"
                  value={formData.maintenanceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Preventive Maintenance">Preventive Maintenance</option>
                  <option value="Routine Check">Routine Check</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Repair">Initial Setup Repair</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Scheduled Date *</label>
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Tech Staff *</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Alex Turner">Alex Turner (Technical Support & Repair)</option>
                <option value="Campus Electrical Specialist">Campus Electrical Specialist</option>
                <option value="HVAC Vendor Specialist">HVAC Vendor Specialist</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Maintenance Instructions & Notes</label>
              <textarea
                name="maintenanceNotes"
                rows="2"
                value={formData.maintenanceNotes}
                onChange={handleChange}
                placeholder="Scope of initial preventive checkup..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

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
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            {initialData ? 'Save Equipment Changes' : 'Register Equipment & Schedule Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
