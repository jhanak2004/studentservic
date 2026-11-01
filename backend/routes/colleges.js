const express = require('express');
const College = require('../models/College');
const CollegeCatalog = require('../models/CollegeCatalog');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
const DEFAULT_COLLEGES = ['RGPV', 'IIT Indore', 'DAVV', 'SSTC', 'NRI College', 'ITM University', 'Sage University'];

router.get('/', async (req, res) => {
  try {
    const initialization = await CollegeCatalog.updateOne(
      { key: 'main' },
      { $setOnInsert: { initialized: true } },
      { upsert: true }
    );
    if (initialization.upsertedCount === 1 && await College.countDocuments() === 0) {
      await College.insertMany(DEFAULT_COLLEGES.map(name => ({ name })));
    }
    res.json(await College.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ message: 'College name is required' });
    const existingColleges = await College.find().select('name');
    if (existingColleges.some(college => college.name.toLowerCase() === name.toLowerCase())) {
      return res.status(409).json({ message: 'This college is already in the list' });
    }
    const college = await College.create({ name });
    res.status(201).json(college);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.json({ message: 'College removed from the list', id: college._id });
  } catch (err) {
    res.status(400).json({ message: 'Invalid college ID' });
  }
});

module.exports = router;
