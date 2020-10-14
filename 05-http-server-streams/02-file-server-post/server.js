const fs = require('fs');
const http = require('http');
const {pipeline, finished, PassThrough} = require('stream');
const {promisify} = require('util');

const {getPathname, getFilepath} = require('./utils');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');
const HttpError = require('./HttpError');

const LIMIT = 1024 * 1024;

const pipelinePromise = promisify(pipeline);
const finishedPromise = promisify(finished);

const server = new http.Server();

const send = (res, status, text = undefined) => {
  res.statusCode = status;
  res.end(text);
};

const checkNestedPath = (pathname) => {
  if (pathname.includes('/')) {
    throw new HttpError(400);
  }
};

const handleError = (err, filepath, res) => {
  if (err instanceof LimitExceededError) {
    fs.unlinkSync(filepath);
    send(res, 413, err.message);
    return;
  }

  if (err instanceof HttpError) {
    send(res, err.status, err.message);
    return;
  }

  if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
    fs.unlinkSync(filepath);
  }

  if (err.code === 'EEXIST') {
    send(res, 409);
    return;
  }

  send(res, 501);
};

const createFile = async (filepath, req) => {
  const transform = new LimitSizeStream({limit: LIMIT});
  const output = fs.createWriteStream(filepath, {flags: 'wx'});
  const source = req.pipe(new PassThrough());

  await new Promise((resolve, reject) => {
    finishedPromise(req).catch(reject);
    pipelinePromise(source, transform, output).then(resolve, reject);
  });
};

server.on('request', async (req, res) => {
  const pathname = getPathname(req.url);
  const filepath = getFilepath(pathname);
  try {
    checkNestedPath(pathname);
    switch (req.method) {
      case 'POST':
        await createFile(filepath, req);
        send(res, 201, 'Created');
        break;

      default:
        send(res, 501, 'Not implemented');
    }
  } catch (err) {
    handleError(err, filepath, res);
  }
});

module.exports = server;
