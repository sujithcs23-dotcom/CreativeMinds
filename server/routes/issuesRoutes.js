import express from 'express';
import { db } from '../db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/issues
router.get('/', verifyToken, (req, res) => {
  return res.json({ success: true, data: db.issues });
});

// POST /api/issues
router.post('/', verifyToken, (req, res) => {
  const { equipmentId, title, description, priority, location, imageUrl } = req.body;
  const targetEq = db.equipment.find(e => e.id === equipmentId);

  const newIssue = {
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

  db.issues.unshift(newIssue);

  // Set equipment status to Reported
  if (targetEq) {
    targetEq.status = 'Reported';
  }

  // Create Downtime record
  db.downtime.unshift({
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
  db.notifications.unshift({
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
});

// PUT /api/issues/:id
router.put('/:id', verifyToken, (req, res) => {
  const issue = db.issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

  const { status, assignedTo, resolutionRemarks } = req.body;
  if (status) issue.status = status;
  if (assignedTo) issue.assignedTo = assignedTo;
  if (resolutionRemarks) issue.resolutionRemarks = resolutionRemarks;

  const eq = db.equipment.find(e => e.id === issue.equipmentId);

  if (status === 'In Progress' || status === 'Assigned') {
    if (eq) eq.status = 'Under Maintenance';
  } else if (status === 'Resolved' || status === 'Closed') {
    issue.resolvedAt = issue.resolvedAt || new Date().toISOString();
    if (eq) eq.status = 'Operational';

    // Close downtime record
    const dt = db.downtime.find(d => d.issueId === issue.id && !d.endTime);
    if (dt) {
      const end = new Date();
      const start = new Date(dt.startTime);
      dt.endTime = end.toISOString();
      dt.durationHours = Number(((end - start) / (1000 * 60 * 60)).toFixed(1));
    }
  }

  return res.json({ success: true, data: issue });
});

export default router;
