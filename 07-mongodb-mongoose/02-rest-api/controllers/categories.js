const CategoryModel = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx) {
  const categories = await CategoryModel.find({});
  ctx.body = {categories};
};
