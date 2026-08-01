import express from 'express';
import { dbService } from '../services/dbService.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await dbService.getAllNotifications();
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notif = await dbService.markNotificationRead(req.params.id);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, data: notif });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
