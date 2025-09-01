const Router = require('koa-router');
const { saveUser, getUserByEmail } = require('../utils/storage.cjs');
const router = new Router();

const authenticateUser = async (ctx, next) => {
  // 简单的认证逻辑实现
  const { email } = ctx.request.body || ctx.params;
  if (!email) {
    ctx.throw(401, '需要用户认证');
  }
  
  // 验证用户是否存在
  const user = await getUserByEmail(email);
  if (!user) {
    ctx.throw(401, '用户不存在');
  }
  
  ctx.state.user = user;
  await next();
};


router.post('/api/auth/register', async (ctx) => {
  const { email, password, username } = ctx.request.body;

  if (!email || !password || !username) {
    ctx.throw(400, '缺少必要字段');
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    ctx.throw(409, '邮箱已被注册');
  }

  await saveUser({ email, password, username });
  ctx.status = 201;
  ctx.body = { message: '注册成功' };
});

router.post('/api/auth/login', async (ctx) => {
  const { email, password } = ctx.request.body;
  if (!email || !password) {
    ctx.throw(400, '缺少邮箱或密码');
  }

  const user = await getUserByEmail(email);
  if (!user) {
    ctx.throw(404, '用户不存在');
  }

  if (user.password !== password) {
    ctx.throw(401, '密码错误');
  }

  ctx.status = 200;
  ctx.body = { message: '登录成功', username: user.username };
});

module.exports = {
  router,
  authenticateUser
};