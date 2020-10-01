const {Transform} = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends Transform {
  constructor({limit, ...options}) {
    super(options);
    this.limit = limit;

    this.size = 0;
  }

  _increaseSizeBy(chunk) {
    this.size += chunk.length;
  }

  _isLimitExceeded() {
    return this.size > this.limit;
  }

  _tryToPushChunk(chunk, callback) {
    if (this._isLimitExceeded()) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }

  _transform(chunk, _, callback) {
    this._increaseSizeBy(chunk);
    this._tryToPushChunk(chunk, callback);
  }
}

module.exports = LimitSizeStream;
