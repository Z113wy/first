const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
require('dotenv').config();

const app = new Koa();
const router = new Router();
const { router: authRouter } = require('./routes/auth.cjs');

// 基础中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message };
    ctx.app.emit('error', err, ctx);
  }
});


// 路由配置
router.get('/', (ctx) => {
  ctx.body = { status: 'OK' };
});

app.use(bodyParser({
  json: true,
  jsonLimit: '10mb'
}));
app.use(authRouter.routes());
app.use(router.routes());
app.use(require('./routes/surveys.cjs').routes());
app.use(require('./routes/answers.cjs').routes());

// 错误处理
app.on('error', (err) => {
  console.error('Server error:', err);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});