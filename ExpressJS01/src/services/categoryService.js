const Category = require('../models/category');

const getAllCategories = async () => {
  return await Category.find().select('_id name');
};

module.exports = {
  getAllCategories,
};
