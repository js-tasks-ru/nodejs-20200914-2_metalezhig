const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx) {
  const {query} = ctx.request.query;
  let products = [];

  if (query) {
    products = await Product.find({$text: {$search: query}});
  }

  ctx.body = {products};
};
