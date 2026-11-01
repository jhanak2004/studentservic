const mongoose = require('mongoose');

const collegeCatalogSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  initialized: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('CollegeCatalog', collegeCatalogSchema);
