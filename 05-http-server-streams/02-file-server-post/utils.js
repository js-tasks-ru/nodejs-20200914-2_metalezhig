const url = require('url');
const path = require('path');

const getPathname = (urlStr) => url.parse(urlStr).pathname.slice(1);
const getFilepath = (pathname) => path.join(__dirname, 'files', pathname);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  getFilepath,
  getPathname,
  delay,
};
