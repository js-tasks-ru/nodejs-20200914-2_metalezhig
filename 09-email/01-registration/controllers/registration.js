const reduce = require('lodash/reduce');
const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx) => {
  try {
    const {email, displayName, password} = ctx.request.body;
    const verificationToken = uuid();
    const user = new User({
      email,
      displayName,
      verificationToken,
    });

    await user.setPassword(password);
    await user.save();
    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.body = {status: 'ok'};
  } catch (err) {
    if (err.errors) {
      const errors = reduce(err.errors, (acc, val, key) => {
        acc[key] = val.message;
        return acc;
      }, {});
      ctx.status = 400;
      ctx.body = {errors};
    } else {
      throw err;
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    return;
  }

  user.verificationToken = undefined;
  await user.save();
  ctx.body = {token: verificationToken};
};
