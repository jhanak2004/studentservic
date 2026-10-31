const mongoose = require('mongoose');

const affidavitSchema = new mongoose.Schema({
  requestId:       { type: String, unique: true },
  studentName:     { type: String, required: true },
  phone:           { type: String, required: true },
  college:         { type: String, required: true },
  year:            { type: String, required: true },
  scholarshipType: { type: String, required: true },
  address:         { type: String, required: true },
  price:           { type: Number, default: 50 },
  status: {
    type: String,
    enum: ['pending', 'processing', 'ready', 'delivered'],
    default: 'pending'
  },
}, { timestamps: true });

affidavitSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.model('Affidavit').countDocuments();
    this.requestId = `AFF${Date.now().toString().slice(-5)}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Affidavit', affidavitSchema);
