import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useEquipment } from '../../context/EquipmentContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Image as ImageIcon } from 'lucide-react';

export const ReportIssueModal = ({ isOpen, onClose }) => {
  const { equipment, reportIssue } = useEquipment();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    equipmentId: equipment[0]?.id || '',
    title: '',
    description: '',
    location: equipment[0]?.location || '',
    priority: 'High',
    imageUrl: ''
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleEquipmentChange = (e) => {
    const selectedId = e.target.value;
    const selectedEq = equipment.find(eq => eq.id === selectedId);
    setFormData(prev => ({
      ...prev,
      equipmentId: selectedId,
      location: selectedEq ? selectedEq.location : ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimulateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setPreviewImage(simulatedUrl);
      setFormData(prev => ({ ...prev, imageUrl: simulatedUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    reportIssue({
      ...formData,
      reportedBy: currentUser.name,
      reportedById: currentUser.id
    });

    setFormData({
      equipmentId: equipment[0]?.id || '',
      title: '',
      description: '',
      location: equipment[0]?.location || '',
      priority: 'High',
      imageUrl: ''
    });
    setPreviewImage(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Equipment Problem / Malfunction (FR-06)"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Malfunctioning Equipment *</label>
          <select
            name="equipmentId"
            value={formData.equipmentId}
            onChange={handleEquipmentChange}
            required
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {equipment.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.name} ({eq.equipmentCode}) — {eq.location}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Headline / Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Screen Flickering & Overheating"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Room</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Urgent Priority *</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="Low">Low - Cosmetic / Minor fault</option>
            <option value="Medium">Medium - Intermittent issue</option>
            <option value="High">High - Impeding class / lab work</option>
            <option value="Critical">Critical - Safety risk / Campus outage</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description of Problem *</label>
          <textarea
            name="description"
            rows="3"
            required
            placeholder="Describe what happened, error codes shown, or conditions during breakdown..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Optional Image Attachment (FR-06) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Attach Image Proof / Photo (Optional)</label>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/60 border border-dashed border-slate-700">
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              onChange={handleSimulateUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Photo
            </label>
            {previewImage ? (
              <div className="flex items-center gap-2">
                <img src={previewImage} alt="Preview" className="w-10 h-10 rounded object-cover" />
                <span className="text-[11px] text-emerald-400">Photo Attached!</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> No photo selected
              </span>
            )}
          </div>
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
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30"
          >
            Submit Incident Report
          </button>
        </div>
      </form>
    </Modal>
  );
};
