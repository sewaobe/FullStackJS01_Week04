const productService = require('../services/productService.js');

const getAllProducts = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const data = await productService.getProducts(page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted', product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

async function searchProducts(req, res) {
  try {
    let {
      keyword,
      category,
      minPrice,
      maxPrice,
      discount,
      minViews,
      page,
      limit,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const data = await productService.searchProducts({
      keyword,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      discount: discount ? discount === 'true' : undefined,
      minViews: minViews ? parseInt(minViews) : undefined,
      page,
      limit,
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching products');
  }
}

async function toggleFavorite(req, res) {
  try {
    const userEmail = req.user && req.user.email; // assume auth middleware sets req.user
    if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });
    const { productId } = req.params;
    const result = await productService.toggleFavorite(userEmail, productId);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function listFavorites(req, res) {
  try {
    const userEmail = req.user && req.user.email;
    if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const favs = await productService.listFavorites(userEmail, page, limit);
    return res.json({ data: favs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function markView(req, res) {
  try {
    const userId = req.user && req.user._id; // optional
    const sessionId = req.headers['x-session-id'] || null; // optional guest session
    const { productId } = req.params;
    await productService.markView({ userId, productId, sessionId });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function recentlyViewed(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Lấy page & limit từ query, mặc định page=1, limit=10
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const list = await productService.getRecentlyViewed(userId, page, limit);

    return res.json({ data: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function similar(req, res) {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const list = await productService.similarProducts(productId, { limit });
    return res.json({ data: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function stats(req, res) {
  try {
    const { productId } = req.params;
    const stats = await productService.productStats(productId);
    return res.json({ data: stats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id; // giả sử đã có middleware auth
    // Lấy chi tiết sản phẩm
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Lấy thống kê (views, favorites, comments, buyers)
    const stats = await productService.productStats(id);

    // Lấy sản phẩm tương tự
    const similar = await productService.similarProducts(id, { limit: 8 });

    // Kiểm tra user đã yêu thích sản phẩm chưa
    let isFavorited = false;
    if (userId) {
      isFavorited = await productService.checkUserFavorited(userId, id);
    }

    return res.json({
      product,
      stats,
      similar,
      isFavorited, // <-- thêm field này
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};
