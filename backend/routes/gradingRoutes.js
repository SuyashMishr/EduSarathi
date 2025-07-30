const express = require('express');
const router = express.Router();
const {
  uploadAnswerSheet,
  gradeAnswerSheet,
  getGradingResults,
  reviewGrading,
  getAnswerSheetsForReview,
  getGradingStats
} = require('../controllers/gradingController');
const { answerSheet } = require('../utils/multerConfig');

router.post('/upload', answerSheet, uploadAnswerSheet);
router.post('/:answerSheetId/grade', gradeAnswerSheet);
router.get('/:answerSheetId/results', getGradingResults);
router.put('/:answerSheetId/review', reviewGrading);
router.get('/review', getAnswerSheetsForReview);
router.get('/stats', getGradingStats);

module.exports = router;