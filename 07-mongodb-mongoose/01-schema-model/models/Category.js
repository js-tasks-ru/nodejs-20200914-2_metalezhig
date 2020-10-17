const mongoose = require('mongoose');

const connection = require('../libs/connection');
const {MODEL_NAMES} = require('./constants');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model(MODEL_NAMES.CATEGORY, categorySchema);
