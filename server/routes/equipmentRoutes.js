import express from 'express';
import { db } from '../db.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/equipment
router.get('/', verifyToken, (req, res) => {
  return res.json({ success: true, data: db.equipment });
});

// GET /api/equipment/:id
router.get('/:id', verifyToken, (req, res) => {
  const item = db.equipment.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' });
  return res.json({ success: true, data: item });
});

// POST /api/equipment (Registers Equipment AND Automatically Creates Preventive Maintenance Schedule)
router.post('/', verifyToken, requireRole(['admin']), (req, res) => {
  const { name, category, department, location, modelNumber, purchaseDate, status, scheduledDate, maintenanceType, priority, assignedTo, maintenanceNotes } = req.body;
  if (!name || !category || !location) {
    return res.status(400).json({ success: false, message: 'Missing required equipment fields.' });
  }

  const generatedCode = req.body.equipmentCode || `EQ-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const newEqId = `eq-${Date.now()}`;

  const newEq = {
    id: newEqId,
    equipmentCode: generatedCode,
    name,
    category,
    department: department || 'General',
    location,
    modelNumber: modelNumber || 'N/A',
    purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
    status: status || 'Operational',
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    nextMaintenanceDate: scheduledDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  db.equipment.unshift(newEq);

  // Automatically create Preventive Maintenance Schedule Task upon equipment registration!
  const newSched = {
    id: `m-${Date.now()}`,
    equipmentId: newEqId,
    equipmentCode: generatedCode,
    equipmentName: newEq.name,
    assignedTo: assignedTo || 'Alex Turner',
    assignedToId: 'u-2',
    maintenanceType: maintenanceType || 'Preventive Maintenance',
    scheduledDate: newEq.nextMaintenanceDate,
    priority: priority || 'Medium',
    status: 'Upcoming',
    notes: maintenanceNotes || 'Initial preventive checkup configured upon equipment addition.',
    completedAt: null
  };

  db.schedules.unshift(newSched);

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: 'u-1',
    role: 'all',
    title: 'Equipment Registered & Maintenance Scheduled',
    message: `${newEq.name} (${generatedCode}) registered in ${newEq.department}. Preventive maintenance scheduled for ${newSched.scheduledDate}.`,
    type: 'info',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, data: newEq, schedule: newSched });
});

// PUT /api/equipment/:id
router.put('/:id', verifyToken, (req, res) => {
  const index = db.equipment.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Equipment not found' });

  db.equipment[index] = { ...db.equipment[index], ...req.body };
  return res.json({ success: true, data: db.equipment[index] });
});

// DELETE /api/equipment/:id
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
  const index = db.equipment.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Equipment not found' });

  const deleted = db.equipment.splice(index, 1)[0];
  return res.json({ success: true, message: 'Equipment deleted', data: deleted });
});

export default router;
