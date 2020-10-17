const mongoose = require('mongoose');

const ProductModel = require('../models/Product');

async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;
  if (!subcategory) {
    return next();
  }

  const products = await ProductModel.find({
    subcategory: new mongoose.Types.ObjectId(subcategory),
  });
  ctx.body = {products};
}

async function productList(ctx) {
  ctx.body = {
    products: await ProductModel.find({}),
  };
}

async function productById(ctx) {
  const {id} = ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400);
  }

  const product = await ProductModel.findById(id);
  if (!product) {
    ctx.throw(404);
  }

  ctx.body = {product};
}

module.exports = {
  productsBySubcategory,
  productList,
  productById,
};

