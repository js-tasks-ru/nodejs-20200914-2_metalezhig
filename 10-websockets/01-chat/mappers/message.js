module.exports = function mapMessage(message) {
  return {
    id: message.id,
    user: message.user,
    date: message.date,
    text: message.text,
  };
};
