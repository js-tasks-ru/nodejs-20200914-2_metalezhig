const mongoose = require('mongoose');

const connection = require('../libs/connection');
const {jsonTransformer} = require('./utils');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

subCategorySchema.set('toJSON', {
  transform: jsonTransformer,
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

categorySchema.set('toJSON', {
  transform: jsonTransformer,
});


module.exports = connection.model('Category', categorySchema);
