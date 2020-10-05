const {Transform} = require('stream');
const {EOL} = require('os');

class LineSplitStream extends Transform {
  constructor(options) {
    super(options);
    this.accumulator = '';
  }


  getAccumulator() {
    return this.accumulator;
  }

  append(line) {
    this.accumulator += line;
  }

  update(line) {
    this.accumulator = line;
  }

  hasEOL() {
    return this.getAccumulator().includes(EOL);
  }

  shift() {
    const [line, ...tail] = this.getAccumulator().split(EOL);
    this.update(tail.join(EOL));

    return line;
  }

  send() {
    this.push(this.shift());
  }

  sendIfPossible() {
    if (this.hasEOL()) {
      this.send();
    }
  }

  isAccumulatorNotEmpty() {
    return this.getAccumulator().length > 0;
  }

  _transform(chunk, _, done) {
    this.append(chunk.toString());
    this.sendIfPossible();

    done();
  }

  _flush(done) {
    if (this.isAccumulatorNotEmpty()) {
      this.send();
    }

    done();
  }
}

module.exports = LineSplitStream;
