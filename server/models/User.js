import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'faculty'], default: 'staff' },
  department: { type: String, default: 'General Campus' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
