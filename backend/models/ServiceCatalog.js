const mongoose = require('mongoose');

const serviceCatalogSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  initialized: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ServiceCatalog', serviceCatalogSchema);
