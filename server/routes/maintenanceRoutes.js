import express from 'express';
import { dbService } from '../services/dbService.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/maintenance
router.get('/', verifyToken, async (req, res) => {
  try {
    const schedules = await dbService.getAllSchedules();
    return res.json({ success: true, data: schedules });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/maintenance
router.post('/', verifyToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const { equipmentId, maintenanceType, scheduledDate, priority, assignedTo, notes } = req.body;
    const targetEq = await dbService.getEquipmentById(equipmentId);

    const newSchedData = {
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

    const newSched = await dbService.createSchedule(newSchedData);

    await dbService.createNotification({
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
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/maintenance/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    if (status === 'Completed') {
      updateData.completedAt = new Date().toISOString();
    }

    const updatedSched = await dbService.updateSchedule(req.params.id, updateData);
    if (!updatedSched) return res.status(404).json({ success: false, message: 'Maintenance task not found' });

    if (status === 'Completed') {
      // Update equipment status
      const eq = await dbService.getEquipmentById(updatedSched.equipmentId);
      if (eq) {
        await dbService.updateEquipment(eq.id, {
          status: 'Operational',
          lastMaintenanceDate: new Date().toISOString().split('T')[0]
        });
      }
    }

    return res.json({ success: true, data: updatedSched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
