const express = require('express');
const {
  getAllProducts,
  createProduct,
  deleteProduct,
  searchProducts,
} = require('../controllers/productController.js');

const router = express.Router();

router.get('/', getAllProducts); // GET /api/products?page=1&limit=10
router.get('/search', searchProducts);
router.post('/', createProduct); // POST /api/products
router.delete('/:id', deleteProduct); // DELETE /api/products/:id

module.exports = router;
