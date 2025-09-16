const Comment = require('../models/comment');
const Product = require('../models/product');

async function createComment(userId, productId, text, rating) {
  // đảm bảo product tồn tại
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const comment = await Comment.create({
    user: userId,
    product: productId,
    text,
    rating,
  });

  // populate user cho tiện
  return comment.populate('user', 'name email');
}

async function getCommentsByProduct(productId) {
  return Comment.find({ product: productId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
}

module.exports = { createComment, getCommentsByProduct };
