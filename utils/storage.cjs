const fs = require('fs');
const path = require('path');

const loadData = (filename) => {
  try {
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return filename === 'users.json' ? [] : {};
    }
    throw err;
  }
};

const saveData = (filename, data) => {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const readUsers = () => loadData('users.json');
const saveUsers = (users) => saveData('users.json', users);

const getUserByEmail = (email) => {
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return null;
  return user;
};

const saveUser = (user) => {
  const users = readUsers();
  const existing = users.find(u => u.email === user.email);
  if (existing) {
    throw new Error('邮箱已被注册');
  }
  users.push({...user, id: user.email});
  saveUsers(users);
};

function saveSurvey(survey) {
  const surveys = loadData('surveys.json');
  surveys[survey.id] = survey;
  saveData('surveys.json', surveys);
}

const loadSurveys = () => loadData('surveys.json');

const getSurveyById = (id) => {
  const surveys = loadSurveys();
  return Object.values(surveys).find(survey => survey.id === id);
};

const findExistingAnswer = (surveyId, userId) => {
  const answers = loadData('answers.json');
  return answers.find(a => a.surveyId === surveyId && a.userId === userId);
};

const saveAnswer = (answerData) => {
  let answers = loadData('answers.json');
  if (!Array.isArray(answers)) {
    answers = [];
  }
  
  // 删除已存在的旧答案
  answers = answers.filter(a => !(a.surveyId === answerData.surveyId && a.userId === answerData.userId));
  
  answers.push(answerData);
  saveData('answers.json', answers);
};
const loadAnswers = () => loadData('answers.json');

module.exports = {
  saveUser,
  saveAnswer,
  getUserByEmail,
  saveSurvey,
  loadSurveys,
  getSurveyById,
  loadData,
  saveData,
  loadAnswers
};


