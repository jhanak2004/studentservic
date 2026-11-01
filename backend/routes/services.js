const express = require('express');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_SERVICES = [
  { id: 'file-pages', name: 'File Pages', icon: '📄', desc: 'Ruled, plain and graph file pages for assignments, practicals & lab records.', price: 2, unit: 'per page', badge: 'Popular' },
  { id: 'book-spiral', name: 'Book Spiral Binding', icon: '📚', desc: 'Professional spiral binding for assignments, projects, and reports.', price: 30, unit: 'per book', badge: null },
  { id: 'files-folders', name: 'Files & Folders', icon: '🗂️', desc: 'L-folders, box files, clear folders, and expandable files.', price: 15, unit: 'per piece', badge: null },
  { id: 'shivani', name: 'Shivani Books', icon: '✍️', desc: 'Shivani publication books, guides, and subject-wise notes for all semesters.', price: 80, unit: 'per book', badge: 'New' },
  { id: 'photocopy', name: 'Photocopy', icon: '🖨️', desc: 'B&W and colour photocopies of documents, notes, marksheets, and certificates.', price: 1, unit: 'per page', badge: 'Popular' },
  { id: 'affidavit', name: 'Scholarship Affidavit', icon: '🎓', desc: 'Official affidavits for scholarship applications — all colleges & years.', price: 50, unit: 'per affidavit', badge: null },
];

// GET /api/services
router.get('/', async (req, res) => {
  try {
    let services = await Service.find().sort({ createdAt: 1 });
    if (services.length === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
      services = await Service.find().sort({ createdAt: 1 });
    }
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/services (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, icon, desc, price, unit, badge } = req.body;
    if (!name?.trim() || !desc?.trim() || !unit?.trim() || price === '' || price === undefined || !Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ message: 'Name, description, a valid price, and price unit are required' });
    }

    const baseId = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const id = `${baseId || 'service'}-${Date.now().toString(36)}`;
    const service = await Service.create({
      id,
      name: name.trim(),
      icon: icon?.trim() || '📦',
      desc: desc.trim(),
      price: Number(price),
      unit: unit.trim(),
      badge: badge?.trim() || null,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
