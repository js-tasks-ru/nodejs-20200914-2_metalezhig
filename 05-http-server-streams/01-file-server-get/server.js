const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {pipeline} = require('stream');
const {promisify} = require('util');
const HttpError = require('../HttpError');

const DEFAULT_ERROR_STATUS = 500;

const pipelinePromise = promisify(pipeline);
const server = new http.Server();

const checkNestedPath = (pathname) => {
  if (pathname.includes('/')) {
    throw new HttpError(400);
  }
};

const checkFileExistence = (filepath) => {
  if (!fs.existsSync(filepath)) {
    throw new HttpError(404);
  }
};

const streamFile = async (filepath, res) => {
  try {
    await pipelinePromise(fs.createReadStream(filepath), res);
  } catch (err) {
    throw new HttpError(500);
  }
};

const sendFile = async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  checkNestedPath(pathname);
  checkFileExistence(filepath);
  await streamFile(filepath, res);
};

const handleError = (err, res) => {
  if (err instanceof HttpError) {
    res.statusCode = err.status;
    res.end(err.message);
  } else {
    res.statusCode = DEFAULT_ERROR_STATUS;
    res.end();
  }
};

const notImplementedStub = () => {
  throw new HttpError(501, 'Not implemented');
};

server.on('request', async (req, res) => {
  try {
    if (req.method === 'GET') {
      await sendFile(req, res);
    } else {
      notImplementedStub();
    }
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = server;
