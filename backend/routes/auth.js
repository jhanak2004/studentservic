const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, college, year, role, adminCode } = req.body;
    if (!name || !phone || !password)
      return res.status(400).json({ message: 'Name, phone and password are required' });
    let accountRole = ['student', 'member', 'admin'].includes(role) ? role : 'student';
    if (role === 'admin') {
      if (!process.env.ADMIN_SIGNUP_CODE) {
        return res.status(403).json({ message: 'Admin sign-up is not enabled. Contact the site administrator.' });
      }
      if (typeof adminCode !== 'string' || adminCode !== process.env.ADMIN_SIGNUP_CODE) {
        return res.status(403).json({ message: 'Invalid admin invitation code' });
      }
      accountRole = 'admin';
    }
    if (await User.findOne({ phone }))
      return res.status(400).json({ message: 'Phone number already registered' });
    const user = await User.create({ name, phone, password, college, year, role: accountRole });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, phone: user.phone, college: user.college, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid phone or password' });
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, phone: user.phone, college: user.college, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(req.user));

// PATCH /api/auth/me — update the signed-in user's profile fields only.
router.patch('/me', protect, async (req, res) => {
  try {
    const updates = {};
    for (const field of ['name', 'phone', 'college', 'year', 'address']) {
      if (req.body[field] !== undefined) updates[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
    if (req.body.role !== undefined) {
      if (req.user.role === 'admin') {
        return res.status(403).json({ message: 'Admin account type cannot be changed in profile settings' });
      }
      if (!['student', 'member'].includes(req.body.role)) {
        return res.status(400).json({ message: 'Choose Student or Member' });
      }
      updates.role = req.body.role;
    }

    if (updates.name !== undefined && !updates.name) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }
    if (updates.phone !== undefined && !/^\d{10}$/.test(updates.phone)) {
      return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
    }
    if (updates.phone && await User.findOne({ phone: updates.phone, _id: { $ne: req.user._id } })) {
      return res.status(409).json({ message: 'This phone number is already registered' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
