const express = require('express');
const router = express.Router();
const {
  generateQuiz,
  getQuizzes,
  getQuizById,
  startQuizAttempt,
  submitQuizAnswers,
  getQuizResults,
  updateQuiz,
  deleteQuiz,
  getQuizStats
} = require('../controllers/quizController');

router.post('/generate', generateQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/start', startQuizAttempt);
router.post('/:id/submit', submitQuizAnswers);
router.get('/results/:answerSheetId', getQuizResults);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);
router.get('/:id/stats', getQuizStats);

module.exports = router;