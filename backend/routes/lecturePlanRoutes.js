const express = require('express');
const router = express.Router();
const {
  generateLecturePlan,
  getLecturePlans,
  getLecturePlanById,
  updateLecturePlan,
  deleteLecturePlan,
  addActivity,
  addResource,
  addAssessment,
  recordImplementation,
  addRating,
  addFeedback,
  getLecturePlanSummary,
  getPopularLecturePlans,
  searchByStandards
} = require('../controllers/lecturePlanController');

router.post('/generate', generateLecturePlan);
router.get('/', getLecturePlans);
router.get('/popular', getPopularLecturePlans);
router.get('/search/standards', searchByStandards);
router.get('/:id', getLecturePlanById);
router.get('/:id/summary', getLecturePlanSummary);
router.put('/:id', updateLecturePlan);
router.delete('/:id', deleteLecturePlan);
router.post('/:id/activity', addActivity);
router.post('/:id/resource', addResource);
router.post('/:id/assessment', addAssessment);
router.post('/:id/implementation', recordImplementation);
router.post('/:id/rating', addRating);
router.post('/:id/feedback', addFeedback);

module.exports = router;