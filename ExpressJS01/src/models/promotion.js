const { default: mongoose } = require('mongoose');
const promotionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  discountPercent: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
});
module.exports = mongoose.model('Promotion', promotionSchema);
