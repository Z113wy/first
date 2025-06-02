const Router = require('koa-router');
const Survey = require('../models/survey.cjs');
const { saveSurvey, loadSurveys } = require('../utils/storage.cjs');
const { authenticateUser } = require('./auth.cjs');

const router = new Router();

router.post('/api/surveys', authenticateUser, async (ctx) => {
  try {
    const surveyData = {
      ...ctx.request.body,
    };

    const survey = new Survey(surveyData);
    await saveSurvey(survey);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: survey
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
});

router.get('/api/surveys/:email', authenticateUser, async (ctx) => {
  try {
    const surveys = await loadSurveys();
    const userSurveys = Object.values(surveys).filter(
      survey => survey.creatorId === ctx.params.email
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: userSurveys
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: '获取问卷列表失败：' + error.message
    };
  }
});

router.put('/api/surveys/:id/publish', authenticateUser, async (ctx) => {
  try {
    const surveys = await loadSurveys();
    const survey = surveys[ctx.params.id];

    if (!survey) {
      ctx.throw(404, '问卷不存在');
    }

    if (survey.status !== 'draft') {
      ctx.throw(400, '只有草稿状态的问卷可以发布');
    }

    survey.status = 'published';
    survey.publishedAt = new Date().toISOString();
    await saveSurvey(survey);

    ctx.body = {
      success: true,
      link: `https://localhost:5173/surveys/${ctx.params.id}`
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
});

router.put('/api/surveys/:id/close', authenticateUser, async (ctx) => {
  try {
    const surveys = await loadSurveys();
    const survey = surveys[ctx.params.id];

    if (!survey) {
      ctx.throw(404, '问卷不存在');
    }

    if (survey.status !== 'published') {
      ctx.throw(400, '只有已发布的问卷可以关闭');
    }

    survey.status = 'closed';
    await saveSurvey(survey);

    ctx.body = {
      success: true,
      message: '问卷已成功关闭'
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message
    };
  }
});


module.exports = router;