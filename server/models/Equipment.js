import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  equipmentCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, default: 'General' },
  location: { type: String, required: true },
  modelNumber: { type: String, default: 'N/A' },
  purchaseDate: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Operational', 'Under Maintenance', 'Reported', 'Out of Service'],
    default: 'Operational' 
  },
  lastMaintenanceDate: { type: String, default: '' },
  nextMaintenanceDate: { type: String, default: '' }
}, {
  timestamps: true
});

export const Equipment = mongoose.model('Equipment', equipmentSchema);
