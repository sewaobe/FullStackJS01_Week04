const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // cho fuzzy search
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // theo danh mục
    discount: { type: Number, default: 0 }, // % khuyến mãi
    views: { type: Number, default: 0 }, // lượt xem
    tags: [{ type: String }], // thêm từ khóa gợi ý tìm kiếm
  },
  { timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);
