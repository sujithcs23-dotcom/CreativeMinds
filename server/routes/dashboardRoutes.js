import express from 'express';
import { dbService } from '../services/dbService.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const equipment = await dbService.getAllEquipment();
    const issues = await dbService.getAllIssues();
    const schedules = await dbService.getAllSchedules();
    const downtime = await dbService.getAllDowntime();

    const totalEquipment = equipment.length;
    const operational = equipment.filter(e => e.status === 'Operational').length;
    const underMaintenance = equipment.filter(e => e.status === 'Under Maintenance').length;
    const outOfService = equipment.filter(e => e.status === 'Out of Service').length;
    const reported = equipment.filter(e => e.status === 'Reported').length;

    const openIssues = issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
    const dueTodaySchedules = schedules.filter(s => s.status === 'Due Today').length;
    const overdueSchedules = schedules.filter(s => s.status === 'Overdue').length;

    const totalDowntimeHours = downtime.reduce((sum, dt) => sum + (dt.durationHours || 0), 0);

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
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/recent-issues
router.get('/recent-issues', verifyToken, async (req, res) => {
  try {
    const issues = await dbService.getAllIssues();
    return res.json({ success: true, data: issues.slice(0, 5) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/upcoming-maintenance
router.get('/upcoming-maintenance', verifyToken, async (req, res) => {
  try {
    const schedules = await dbService.getAllSchedules();
    const upcoming = schedules.filter(s => s.status === 'Due Today' || s.status === 'Overdue' || s.status === 'Upcoming');
    return res.json({ success: true, data: upcoming });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
