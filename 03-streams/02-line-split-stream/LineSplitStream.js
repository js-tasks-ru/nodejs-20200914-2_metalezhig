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

  isAccumulatorNotEmpty() {
    return this.getAccumulator().length > 0;
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

  pushMany(lines) {
    lines.forEach(this.push.bind(this));
  }

  shiftPendingLines() {
    const pendingLines = this.getAccumulator().split(EOL);
    const unfinished = pendingLines.pop();

    this.update(unfinished);

    return pendingLines;
  }

  sendPending() {
    if (this.hasEOL()) {
      this.pushMany(this.shiftPendingLines());
    }
  }

  _transform(chunk, _, done) {
    this.append(chunk.toString());
    this.sendPending();

    done();
  }

  _flush(done) {
    if (this.isAccumulatorNotEmpty()) {
      this.push(this.getAccumulator());
    }

    done();
  }
}

module.exports = LineSplitStream;
