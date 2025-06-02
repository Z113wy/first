const Router = require('koa-router');
const { getSurveyById, saveAnswer, loadAnswers } = require('../utils/storage.cjs');
const { authenticateUser } = require('./auth.cjs');
const router = new Router();

router.post('/api/surveys/:id/:email/submit', authenticateUser, async (ctx) => {
  try {
    const surveyId = ctx.params.id;
    const submiter = ctx.params.email;
    const answers = ctx.request.body;

    // 验证请求体格式
    if (!Array.isArray(answers)) {
      ctx.throw(400, '无效的答案格式');
    }

    // 获取问卷并校验状态
    const survey = await getSurveyById(surveyId);
    if (!survey) ctx.throw(404, '问卷不存在');
    if (survey.status !== 'published') ctx.throw(403, '问卷未发布');

    // 保存答案
    await saveAnswer({
      surveyId,
      userId: submiter,
      answers,
      submitTime: new Date().toISOString()
    });

    ctx.status = 201;
    ctx.body = { message: '答案提交成功' };
  } catch (err) {
    ctx.throw(err.status || 500, err.message);
  }
});

router.get('/api/users/:email/answers', authenticateUser, async (ctx) => {
  try {
    const email = ctx.params.email;
    const allAnswers = await loadAnswers();
    const userAnswers = allAnswers.filter(a => a.userId === email);
    ctx.body = { 
      success: true,
      data: userAnswers
    };
  } catch (err) {
    ctx.throw(err.status || 500, err.message);
  }
});

router.get('/api/surveys/:id/answers', async (ctx) => {
  try {
    const surveyId = ctx.params.id;
    
    // 验证问卷是否存在
    const survey = await getSurveyById(surveyId);
    if (!survey) ctx.throw(404, '问卷不存在');

    // 获取并过滤答案
    const allAnswers = await loadAnswers();
    const surveyAnswers = allAnswers.filter(a => a.surveyId === surveyId);

    ctx.body = {
      success: true,
      data: surveyAnswers
    };
  } catch (err) {
    ctx.throw(err.status || 500, err.message);
  }
});

module.exports = router;