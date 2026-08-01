import express from 'express';
import { db } from '../db.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/maintenance
router.get('/', verifyToken, (req, res) => {
  return res.json({ success: true, data: db.schedules });
});

// POST /api/maintenance
router.post('/', verifyToken, requireRole(['admin', 'staff']), (req, res) => {
  const { equipmentId, maintenanceType, scheduledDate, priority, assignedTo, notes } = req.body;
  const targetEq = db.equipment.find(e => e.id === equipmentId);

  const newSched = {
    id: `m-${Date.now()}`,
    equipmentId,
    equipmentCode: targetEq ? targetEq.equipmentCode : 'EQ-GEN',
    equipmentName: targetEq ? targetEq.name : 'Unknown Equipment',
    assignedTo: assignedTo || 'Alex Turner',
    assignedToId: 'u-2',
    maintenanceType: maintenanceType || 'Preventive Maintenance',
    scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
    priority: priority || 'Medium',
    status: 'Upcoming',
    notes: notes || '',
    completedAt: null
  };

  db.schedules.unshift(newSched);

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: 'u-2',
    role: 'staff',
    title: 'New Task Assigned',
    message: `You have been assigned maintenance on ${newSched.equipmentName}.`,
    type: 'warning',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, data: newSched });
});

// PUT /api/maintenance/:id
router.put('/:id', verifyToken, (req, res) => {
  const sched = db.schedules.find(s => s.id === req.params.id);
  if (!sched) return res.status(404).json({ success: false, message: 'Maintenance task not found' });

  const { status, notes } = req.body;
  if (status) sched.status = status;
  if (notes) sched.notes = notes;

  if (status === 'Completed') {
    sched.completedAt = new Date().toISOString();
    // Update equipment status
    const eq = db.equipment.find(e => e.id === sched.equipmentId);
    if (eq) {
      eq.status = 'Operational';
      eq.lastMaintenanceDate = new Date().toISOString().split('T')[0];
    }
  }

  return res.json({ success: true, data: sched });
});

export default router;
