const mongoose = require('mongoose');

const connection = require('../libs/connection');
const {MODEL_NAMES} = require('./constants');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: MODEL_NAMES.CATEGORY,
    required: true,
  },
  subcategory: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  images: [String],
});

module.exports = connection.model(MODEL_NAMES.PRODUCT, productSchema);
