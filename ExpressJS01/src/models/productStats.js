const { default: mongoose } = require('mongoose');
const productStatsSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  views: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
});
module.exports = mongoose.model('ProductStats', productStatsSchema);
