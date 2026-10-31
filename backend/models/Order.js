const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId:     { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName:{ type: String, required: true },
  phone:       { type: String, required: true },
  service:     { type: String, required: true },
  serviceIcon: { type: String, default: '📦' },
  college:     { type: String, required: true },
  quantity:    { type: Number, default: 1 },
  address:     { type: String, required: true },
  notes:       { type: String, default: '' },
  price:       { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String, default: 'cod' },
  deliveredAt:   { type: Date },
}, { timestamps: true });

// Auto-generate orderId before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `SS${Date.now().toString().slice(-6)}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
