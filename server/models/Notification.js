import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  userId: { type: String, default: 'all' },
  role: { type: String, default: 'all' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'urgent'], default: 'info' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
