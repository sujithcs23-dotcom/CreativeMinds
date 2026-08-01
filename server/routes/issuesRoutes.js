import express from 'express';
import { dbService } from '../services/dbService.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/issues
router.get('/', verifyToken, async (req, res) => {
  try {
    const issues = await dbService.getAllIssues();
    return res.json({ success: true, data: issues });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/issues
router.post('/', verifyToken, async (req, res) => {
  try {
    const { equipmentId, title, description, priority, location, imageUrl } = req.body;
    const targetEq = await dbService.getEquipmentById(equipmentId);

    const newIssueData = {
      id: `iss-${Date.now()}`,
      equipmentId,
      equipmentCode: targetEq ? targetEq.equipmentCode : 'EQ-GEN',
      equipmentName: targetEq ? targetEq.name : 'Unknown Equipment',
      location: location || (targetEq ? targetEq.location : 'Campus'),
      reportedBy: req.user.name,
      reportedById: req.user.id,
      assignedTo: 'Unassigned',
      assignedToId: null,
      title,
      description,
      priority: priority || 'High',
      status: 'Reported',
      reportedAt: new Date().toISOString(),
      resolvedAt: null,
      resolutionRemarks: '',
      imageUrl: imageUrl || ''
    };

    const newIssue = await dbService.createIssue(newIssueData);

    // Set equipment status to Reported
    if (targetEq) {
      await dbService.updateEquipment(targetEq.id, { status: 'Reported' });
    }

    // Create Downtime record
    await dbService.createDowntime({
      id: `dt-${Date.now()}`,
      equipmentId: newIssue.equipmentId,
      equipmentCode: newIssue.equipmentCode,
      equipmentName: newIssue.equipmentName,
      issueId: newIssue.id,
      startTime: new Date().toISOString(),
      endTime: null,
      durationHours: 0,
      reason: newIssue.title
    });

    // Notify admin
    await dbService.createNotification({
      id: `notif-${Date.now()}`,
      userId: 'u-1',
      role: 'admin',
      title: 'New Equipment Issue Reported',
      message: `${newIssue.reportedBy} reported an issue on ${newIssue.equipmentName}.`,
      type: 'urgent',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ success: true, data: newIssue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/issues/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { status, assignedTo, resolutionRemarks } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolutionRemarks) updateData.resolutionRemarks = resolutionRemarks;

    if (status === 'Resolved' || status === 'Closed') {
      updateData.resolvedAt = new Date().toISOString();
    }

    const updatedIssue = await dbService.updateIssue(req.params.id, updateData);
    if (!updatedIssue) return res.status(404).json({ success: false, message: 'Issue not found' });

    const eq = await dbService.getEquipmentById(updatedIssue.equipmentId);

    if (status === 'In Progress' || status === 'Assigned') {
      if (eq) await dbService.updateEquipment(eq.id, { status: 'Under Maintenance' });
    } else if (status === 'Resolved' || status === 'Closed') {
      if (eq) await dbService.updateEquipment(eq.id, { status: 'Operational' });

      // Close downtime record
      const end = new Date();
      const allDowntimes = await dbService.getAllDowntime();
      const dt = allDowntimes.find(d => d.issueId === updatedIssue.id && !d.endTime);
      if (dt) {
        const start = new Date(dt.startTime);
        const durationHours = Number(((end - start) / (1000 * 60 * 60)).toFixed(1));
        await dbService.updateDowntime(updatedIssue.id, {
          endTime: end.toISOString(),
          durationHours
        });
      }
    }

    return res.json({ success: true, data: updatedIssue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
