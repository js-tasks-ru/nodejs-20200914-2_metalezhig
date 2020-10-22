const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx) {
  const messages = await Message.find({chat: ctx.user.id}).limit(20);
  ctx.body = {messages: messages.map(mapMessage)};
};
