const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx) {
  const user = ctx.user;
  if (!user) {
    ctx.throw(401);
    return;
  }

  const {product, phone, address} = ctx.request.body || {};
  const foundProduct = await Product.findById(product);
  const order = new Order({
    user: user.id,
    product,
    phone,
    address,
  });
  await order.save();
  await sendMail({
    template: 'order-confirmation',
    to: user.email,
    subject: 'Подтверждение заказа',
    locals: {
      id: product,
      product: foundProduct,
    },
  });
  ctx.status = 200;
  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx) {
  const user = ctx.user;
  const orders = await Order.find({user: user.id}).populate('Product');
  ctx.status = 200;
  ctx.body = {orders};
};
