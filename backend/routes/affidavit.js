const express = require('express');
const router = express.Router();
const Affidavit = require('../models/Affidavit');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/affidavit
router.post('/', async (req, res) => {
  try {
    const { studentName, phone, college, year, scholarshipType, address } = req.body;
    if (!studentName || !phone || !college || !year || !scholarshipType || !address)
      return res.status(400).json({ message: 'All fields are required' });
    const aff = await Affidavit.create({ studentName, phone, college, year, scholarshipType, address });
    res.status(201).json(aff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/affidavit/track/:requestId
router.get('/track/:requestId', async (req, res) => {
  try {
    const aff = await Affidavit.findOne({ requestId: req.params.requestId });
    if (!aff) return res.status(404).json({ message: 'Affidavit request not found' });
    res.json(aff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/affidavit — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const affs = await Affidavit.find().sort({ createdAt: -1 });
    res.json(affs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
