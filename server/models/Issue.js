import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  equipmentId: { type: String, required: true },
  equipmentCode: { type: String, required: true },
  equipmentName: { type: String, required: true },
  location: { type: String, required: true },
  reportedBy: { type: String, required: true },
  reportedById: { type: String, default: null },
  assignedTo: { type: String, default: 'Unassigned' },
  assignedToId: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'High' },
  status: { type: String, enum: ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Reported' },
  reportedAt: { type: String, default: () => new Date().toISOString() },
  resolvedAt: { type: String, default: null },
  resolutionRemarks: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, {
  timestamps: true
});

export const Issue = mongoose.model('Issue', issueSchema);
