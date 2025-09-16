const express = require('express');
const auth = require('../middleware/auth.js');
const {
  getAllProducts,
  createProduct,
  deleteProduct,
  searchProducts,
  toggleFavorite,
  listFavorites,
  markView,
  recentlyViewed,
  similar,
  stats,
  getProductById,
} = require('../controllers/productController.js');
const {
  createComment,
  listComments,
} = require('../controllers/commentController.js');
console.log(createComment);
const router = express.Router();

// === Products ===
router.get('/', getAllProducts); // GET /v1/api/products?page=1&limit=10
router.get('/search', searchProducts); // GET /v1/api/products/search
router.post('/', createProduct); // POST /v1/api/products
router.delete('/:id', deleteProduct); // DELETE /v1/api/products/:id

// === Favorites ===
router.post('/favorites/:productId', auth, toggleFavorite); // POST /v1/api/products/favorites/:productId
router.get('/favorites', auth, listFavorites); // GET /v1/api/products/favorites

// === Comments ===
router.post('/:productId/comments', auth, createComment); // POST /v1/api/products/:productId/comments
router.get('/:productId/comments', listComments); // GET /v1/api/products/:productId/comments

// === Views ===
router.post('/:productId/view', markView); // POST /v1/api/products/:productId/view
router.get('/users/me/views', auth, recentlyViewed);

// === Similar products ===
router.get('/:productId/similar', similar); // GET /v1/api/products/:productId/similar

// === Product stats ===
router.get('/:productId/stats', stats); // GET /v1/api/products/:productId/stats

// === Get product by id ===
router.get('/:id', auth, getProductById); // GET /v1/api/products/:id

module.exports = router;
