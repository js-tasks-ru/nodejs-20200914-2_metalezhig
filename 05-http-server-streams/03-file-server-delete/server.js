const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const HttpError = require('./HttpError');

const server = new http.Server();

const sendFactory = (res) => (status, message) => {
  res.statusCode = status;
  res.end(message);
};

const checkNested = (pathname) => {
  if (pathname.includes('/')) {
    throw new HttpError(400, 'Bad Request');
  }
};

const deleteFile = (filepath) => {
  try {
    fs.statSync(filepath);
    fs.unlinkSync(filepath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new HttpError(404, 'Not found');
    }
  }
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const send = sendFactory(res);

  try {
    checkNested(pathname);
    switch (req.method) {
      case 'DELETE':
        deleteFile(filepath);
        send(200, 'OK');
        break;

      default:
        send(501, 'Not Implemented');
    }
  } catch (err) {
    if (err instanceof HttpError) {
      send(err.status, res.message);
      return;
    }

    send(500, 'Internal Server Error');
  }
});

module.exports = server;
