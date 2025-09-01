const { v4: uuidv4 } = require('uuid');

const AnswerItem = {
  surveyId: String,
  userId: String,
  value: String | Number | Boolean
};

const AnswerData = {
  surveyId: String,
  userId: String,
  responses: AnswerItem,
  submittedAt: String
};

class Answer {
  constructor({
    id = uuidv4(),
    surveyId,
    userId,
    responses = [],
    submittedAt = new Date()
  }) {
    if (!surveyId) throw new Error('问卷ID为必填字段');
    if (!userId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId)) throw new Error('用户邮箱格式无效');
    
    this.id = id;
    this.surveyId = surveyId;
    this.userId = userId;

    if (!Array.isArray(responses)) throw new Error('答案必须为数组');
    this.responses = responses.map(res => {
      if (!res.questionId) throw new Error('问题ID缺失');
      if (typeof res.answer === 'undefined') throw new Error('答案内容缺失');
      return res;
    });

    this.submittedAt = submittedAt instanceof Date 
      ? submittedAt 
      : new Date(submittedAt);
  }
}

module.exports = Answer;