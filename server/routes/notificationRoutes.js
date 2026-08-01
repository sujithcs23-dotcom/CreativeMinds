import express from 'express';
import { db } from '../db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/notifications
router.get('/', verifyToken, (req, res) => {
  return res.json({ success: true, data: db.notifications });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', verifyToken, (req, res) => {
  const notif = db.notifications.find(n => n.id === req.params.id);
  if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });

  notif.isRead = true;
  return res.json({ success: true, data: notif });
});

export default router;
