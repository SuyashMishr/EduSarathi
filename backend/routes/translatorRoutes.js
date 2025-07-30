const express = require('express');
const router = express.Router();
const {
  translateText,
  translateCurriculum,
  translateQuiz,
  getSupportedLanguages,
  detectLanguage,
  batchTranslate,
  getTranslationHistory
} = require('../controllers/translatorController');

router.post('/text', translateText);
router.post('/curriculum', translateCurriculum);
router.post('/quiz', translateQuiz);
router.get('/languages', getSupportedLanguages);
router.post('/detect', detectLanguage);
router.post('/batch', batchTranslate);
router.get('/history', getTranslationHistory);

module.exports = router;