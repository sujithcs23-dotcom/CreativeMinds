import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both campus email and password.' });
  }

  // Find user by email
  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User email not found.' });
  }

  // Verify password with bcrypt
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
  }

  // Generate JWT Token
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatar: user.avatar
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: payload
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing required registration fields.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email address is already registered.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    role,
    department: department || 'General Campus',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  const payload = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    department: newUser.department,
    avatar: newUser.avatar
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: payload
  });
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
