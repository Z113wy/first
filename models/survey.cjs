const { v4: uuidv4 } = require('uuid');

SurveyStatus={
  DRAFT:'draft',
  PUBLISHED:'published',
  CLOSED:'closed'
}
SurveyData={
  id:String,
  title:String,
  description:String,
  creatorId:String,
  questions:QuestionData,
  status :SurveyStatus,
  createdAt:Data|String,
  publishedAt:Data|String
}
class Survey {
  constructor({
    id = uuidv4(),
    title,
    description,
    creatorId,
    questions = [],
    status = 'draft',
    createdAt = new Date(),
    publishedAt
  }) {
    if (!title) throw new Error('问卷标题为必填字段');
    this.id = id;
    this.title = title;
    this.description = description;
    
    if (!creatorId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorId)) throw new Error('创建者邮箱格式无效');
    this.creatorId = creatorId;

    if (!Array.isArray(questions)) throw new Error('问题必须为数组');
    this.questions = questions;


    if (!['draft', 'published', 'closed'].includes(status)) {
      throw new Error('无效的问卷状态');
    }
    this.status = status;
    
    this.createdAt = createdAt;
    
    if (status === 'published') {
      this.publishedAt = publishedAt || new Date();
    }
  }
}

module.exports = Survey;