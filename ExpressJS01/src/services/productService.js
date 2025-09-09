const client = require('../config/elasticSearch.js');
const Product = require('../models/product.js');
const Category = require('../models/category'); // import model Category

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

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  searchProducts,
  syncProductsToElastic,
};
