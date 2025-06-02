const { v4: uuidv4 } = require('uuid');

questionTypes={
  SINGLE:'single',
  MULTIPLE:'multiple',
  TEXT:'text',
  SLIDER:'slider',
  RATING:'rating',
  DROPDOWN:'dropdown',
  LOCATION:'location'
}
questionData={
  id:String,
  type: questionTypes,
  title:String,
  required :Boolean,
  options:string,
  min:Number,
  max:Number,
  step:Number
}

class Question {
  constructor({ 
    id = uuidv4(),
    type,
    title,
    required = false,
    options,
    min,
    max,
    step
  }) {
    this.id = id;
    
    if (!['single', 'multiple', 'text', 'slider', 'rating', 'dropdown', 'location'].includes(type)) {
      throw new Error('无效的问题类型');
    }
    this.type = type;

    if (!title) throw new Error('标题为必填字段');
    this.title = title;
    
    this.required = Boolean(required);

    if (['single', 'multiple', 'dropdown'].includes(type) && !options) {
      throw new Error('该类型问题必须提供选项');
    }
    this.options = options || undefined;

    if (['slider', 'rating'].includes(type)) {
      if (typeof min !== 'number' || typeof max !== 'number') {
        throw new Error('滑动条/评分类型必须设置min和max');
      }
      this.min = min;
      this.max = max;
      this.step = type === 'slider' ? (step || 1) : undefined;
    }
  }
}

module.exports = Question;