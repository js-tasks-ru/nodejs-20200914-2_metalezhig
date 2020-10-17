function jsonTransformer(_, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

module.exports = {
  jsonTransformer,
};
