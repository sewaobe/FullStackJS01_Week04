const client = require('../config/elasticSearch.js');
const Product = require('../models/product.js');
const Category = require('../models/category'); // import model Category
const Favorite = require('../models/favorite');
const View = require('../models/view');
const Order = require('../models/order');
const Comment = require('../models/comment');
const User = require('../models/user.js');
const { Types } = require('mongoose');

const getProducts = async (page, limit) => {
  const skip = (page - 1) * limit;

  const products = await Product.find().skip(skip).limit(limit);
  const total = await Product.countDocuments();

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

async function searchProducts({
  keyword,
  category,
  minPrice,
  maxPrice,
  discount,
  minViews,
  page,
  limit,
}) {
  const must = [];
  const filter = [];

  if (keyword) {
    must.push({
      multi_match: {
        query: keyword,
        fields: ['name^3', 'categoryName^2'],
        fuzziness: 'AUTO',
      },
    });
  }

  if (category) {
    filter.push({ term: { category: category.toString() } }); // category = ID
  }

  if (minPrice || maxPrice) {
    filter.push({
      range: {
        price: {
          gte: minPrice || 0,
          lte: maxPrice || 1000000000,
        },
      },
    });
  }

  if (discount !== undefined) {
    filter.push({ term: { discount } });
  }

  if (minViews) {
    filter.push({
      range: {
        views: { gte: minViews },
      },
    });
  }

  const from = (page - 1) * limit;

  const result = await client.search({
    index: 'products',
    from,
    size: limit,
    query: {
      bool: { must, filter },
    },
  });

  // Lấy product từ Elastic
  const products = await Promise.all(
    result.hits.hits.map(async (hit) => {
      const prod = { id: hit._id, ...hit._source };
      // 🔥 Join thêm tên category từ MongoDB
      if (prod.category) {
        const cat = await Category.findById(prod.category).select('name');
        prod.categoryName = cat ? cat.name : null;
      }
      return prod;
    }),
  );

  return {
    products,
    pagination: {
      total: result.hits.total.value,
      page,
      limit,
      totalPages: Math.ceil(result.hits.total.value / limit),
    },
  };
}

async function syncProductsToElastic() {
  const products = await Product.find().populate('category', 'name');

  for (const product of products) {
    await client.index({
      index: 'products',
      id: product._id.toString(),
      document: {
        name: product.name,
        category: product.category._id.toString(), // ID
        categoryName: product.category.name, // 👈 Lưu thêm tên
        price: product.price,
        discount: product.discount,
        views: product.views,
        image: product.image,
      },
    });
  }

  await client.indices.refresh({ index: 'products' });
  console.log(
    '✅ Synced MongoDB products to Elasticsearch (with categoryName)',
  );
}

async function toggleFavorite(userEmail, productId) {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new Error('User not found');

  const userId = user._id;
  const exists = await Favorite.findOne({ user: userId, product: productId });

  if (exists) {
    await Favorite.deleteOne({ _id: exists._id }); // 👈 fix chỗ này
    return { favorited: false };
  }

  await Favorite.create({ user: userId, product: productId });
  return { favorited: true };
}

async function listFavorites(userEmail, page = 1, limit = 20) {
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new Error('User not found');

  const userId = user._id;
  const skip = (page - 1) * limit;
  const favs = await Favorite.find({ user: userId })
    .populate('product')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return favs.map((f) => f.product);
}

async function markView({ userId, productId, sessionId }) {
  // Tăng views trong Product
  await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });

  // Lưu record vào View collection
  const view = new View({
    user: userId || null,
    product: productId,
    sessionId: sessionId || null,
  });
  await view.save();

  return view;
}

async function productStats(productId) {
  const productObjectId = new Types.ObjectId(productId);

  // buyersCount: count distinct users who ordered this product (status not cancelled)
  const buyers = await Order.aggregate([
    {
      $match: {
        'items.product': productObjectId,
        status: { $ne: 'cancelled' },
      },
    },
    { $unwind: '$items' },
    {
      $match: {
        'items.product': productObjectId,
      },
    },
    { $group: { _id: '$user' } },
    { $count: 'buyersCount' },
  ]);

  const buyersCount = buyers[0] ? buyers[0].buyersCount : 0;

  const commentsCount = await Comment.countDocuments({
    product: productObjectId,
  });
  const viewsCount = await View.countDocuments({ product: productObjectId });
  const favoritesCount = await Favorite.countDocuments({
    product: productObjectId,
  });

  return { buyersCount, commentsCount, viewsCount, favoritesCount };
}

async function getProductById(id) {
  return Product.findById(id).populate('category', 'name');
}

async function getRecentlyViewed(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const views = await View.find({ user: userId })
    .populate('product')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Trả về sản phẩm
  return views.map((v) => v.product);
}

async function similarProducts(productId, { limit = 10 }) {
  const product = await Product.findById(productId).populate(
    'category',
    'name',
  );
  if (!product) throw new Error('Product not found');

  const products = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id }, // loại bỏ chính nó
  }).limit(limit);

  return products;
}
async function checkUserFavorited(userId, productId) {
  const favorite = await Favorite.findOne({ user: userId, product: productId });
  console.log('>>>>Favorite', favorite);
  return !!favorite;
}

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  searchProducts,
  syncProductsToElastic,
  productStats,
  markView,
  listFavorites,
  toggleFavorite,
  getProductById,
  getRecentlyViewed,
  similarProducts,
  checkUserFavorited,
};
