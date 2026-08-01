import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  equipmentId: { type: String, required: true },
  equipmentCode: { type: String, required: true },
  equipmentName: { type: String, required: true },
  assignedTo: { type: String, default: 'Unassigned' },
  assignedToId: { type: String, default: null },
  maintenanceType: { type: String, default: 'Preventive Maintenance' },
  scheduledDate: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Upcoming', 'Due Today', 'Overdue', 'Completed', 'In Progress'], default: 'Upcoming' },
  notes: { type: String, default: '' },
  completedAt: { type: String, default: null }
}, {
  timestamps: true
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);
