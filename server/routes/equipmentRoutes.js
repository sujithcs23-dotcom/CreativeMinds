import express from 'express';
import { dbService } from '../services/dbService.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/equipment
router.get('/', verifyToken, async (req, res) => {
  try {
    const equipment = await dbService.getAllEquipment();
    return res.json({ success: true, data: equipment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/equipment/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const item = await dbService.getEquipmentById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' });
    return res.json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/equipment (Registers Equipment AND Automatically Creates Preventive Maintenance Schedule)
router.post('/', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, category, department, location, modelNumber, purchaseDate, status, scheduledDate, maintenanceType, priority, assignedTo, maintenanceNotes } = req.body;
    if (!name || !category || !location) {
      return res.status(400).json({ success: false, message: 'Missing required equipment fields.' });
    }

    const generatedCode = req.body.equipmentCode || `EQ-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEqId = `eq-${Date.now()}`;

    const newEqData = {
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

    const newEq = await dbService.createEquipment(newEqData);

    // Automatically create Preventive Maintenance Schedule Task upon equipment registration!
    const newSchedData = {
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

    const newSched = await dbService.createSchedule(newSchedData);

    await dbService.createNotification({
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
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/equipment/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await dbService.updateEquipment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Equipment not found' });
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/equipment/:id
router.delete('/:id', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const deleted = await dbService.deleteEquipment(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Equipment not found' });
    return res.json({ success: true, message: 'Equipment deleted', data: deleted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
