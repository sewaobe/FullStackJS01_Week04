const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional for guests
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sessionId: String, // optional — identify guests
  createdAt: { type: Date, default: Date.now },
});

viewSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('View', viewSchema);
