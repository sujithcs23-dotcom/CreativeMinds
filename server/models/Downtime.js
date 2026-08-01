import mongoose from 'mongoose';

const downtimeSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  equipmentId: { type: String, required: true },
  equipmentCode: { type: String, required: true },
  equipmentName: { type: String, required: true },
  issueId: { type: String, default: null },
  startTime: { type: String, default: () => new Date().toISOString() },
  endTime: { type: String, default: null },
  durationHours: { type: Number, default: 0 },
  reason: { type: String, default: '' }
}, {
  timestamps: true
});

export const Downtime = mongoose.model('Downtime', downtimeSchema);
