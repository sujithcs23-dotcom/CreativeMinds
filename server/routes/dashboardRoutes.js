import express from 'express';
import { db } from '../db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', verifyToken, (req, res) => {
  const totalEquipment = db.equipment.length;
  const operational = db.equipment.filter(e => e.status === 'Operational').length;
  const underMaintenance = db.equipment.filter(e => e.status === 'Under Maintenance').length;
  const outOfService = db.equipment.filter(e => e.status === 'Out of Service').length;
  const reported = db.equipment.filter(e => e.status === 'Reported').length;

  const openIssues = db.issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
  const dueTodaySchedules = db.schedules.filter(s => s.status === 'Due Today').length;
  const overdueSchedules = db.schedules.filter(s => s.status === 'Overdue').length;

  const totalDowntimeHours = db.downtime.reduce((sum, dt) => sum + (dt.durationHours || 0), 0);

  return res.json({
    success: true,
    data: {
      totalEquipment,
      operational,
      underMaintenance,
      outOfService,
      reported,
      openIssues,
      dueTodaySchedules,
      overdueSchedules,
      totalDowntimeHours: totalDowntimeHours.toFixed(1)
    }
  });
});

// GET /api/dashboard/recent-issues
router.get('/recent-issues', verifyToken, (req, res) => {
  return res.json({ success: true, data: db.issues.slice(0, 5) });
});

// GET /api/dashboard/upcoming-maintenance
router.get('/upcoming-maintenance', verifyToken, (req, res) => {
  const upcoming = db.schedules.filter(s => s.status === 'Due Today' || s.status === 'Overdue' || s.status === 'Upcoming');
  return res.json({ success: true, data: upcoming });
});

export default router;
