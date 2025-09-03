const Product = require('../models/product.js');

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

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
};
