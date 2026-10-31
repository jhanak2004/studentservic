const express = require('express');
const router = express.Router();

const SERVICES = [
  { id: 'file-pages',    name: 'File Pages',          icon: '📄', desc: 'Ruled, plain and graph file pages for assignments, practicals & lab records.', price: 2,  unit: 'per page',  badge: 'Popular' },
  { id: 'book-spiral',   name: 'Book Spiral Binding',  icon: '📚', desc: 'Professional spiral binding for assignments, projects, and reports.',           price: 30, unit: 'per book',  badge: null },
  { id: 'files-folders', name: 'Files & Folders',      icon: '🗂️', desc: 'L-folders, box files, clear folders, and expandable files.',                    price: 15, unit: 'per piece', badge: null },
  { id: 'shivani',       name: 'Shivani Books',        icon: '✍️', desc: 'Shivani publication books, guides, and subject-wise notes for all semesters.',   price: 80, unit: 'per book',  badge: 'New' },
  { id: 'photocopy',     name: 'Photocopy',            icon: '🖨️', desc: 'B&W and colour photocopies of documents, notes, marksheets, and certificates.',  price: 1,  unit: 'per page',  badge: 'Popular' },
  { id: 'affidavit',     name: 'Scholarship Affidavit',icon: '🎓', desc: 'Official affidavits for scholarship applications — all colleges & years.',        price: 50, unit: 'per affidavit', badge: null },
];

// GET /api/services
router.get('/', (req, res) => res.json(SERVICES));

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const svc = SERVICES.find(s => s.id === req.params.id);
  if (!svc) return res.status(404).json({ message: 'Service not found' });
  res.json(svc);
});

module.exports = router;
