const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const MESSAGE_EVENT = 'app:message';

const getMessage = (ctx) => {
  return new Promise((resolve) => ctx.app.once(MESSAGE_EVENT, resolve));
};

router.get('/subscribe', async (ctx, next) => {
  ctx.response.body = await getMessage(ctx);
  return next();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message) {
    ctx.app.emit(MESSAGE_EVENT, ctx.request.body.message);
  }
  ctx.response.status = 200;
  return next();
});

app.use(router.routes());

module.exports = app;
