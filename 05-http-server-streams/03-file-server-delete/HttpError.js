class HttpError extends Error {
  constructor(status, message = undefined) {
    super(message);

    this.status = status;
    this.name = this.constructor.name;
    this.code = `Error status: ${status}`;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = HttpError;
