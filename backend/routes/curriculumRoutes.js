const express = require('express');
const router = express.Router();
const {
  generateCurriculum,
  getCurricula,
  getCurriculumById,
  updateCurriculum,
  deleteCurriculum,
  addRating,
  getPopularCurricula,
  getCurriculumStats
} = require('../controllers/curriculumController');

// @route   POST /api/curriculum/generate
// @desc    Generate curriculum using AI
// @access  Public (should be protected in production)
router.post('/generate', generateCurriculum);

// @route   GET /api/curriculum
// @desc    Get all curricula with filtering and pagination
// @access  Public
router.get('/', getCurricula);

// @route   GET /api/curriculum/popular
// @desc    Get popular curricula
// @access  Public
router.get('/popular', getPopularCurricula);

// @route   GET /api/curriculum/stats
// @desc    Get curriculum statistics
// @access  Public
router.get('/stats', getCurriculumStats);

// @route   GET /api/curriculum/:id
// @desc    Get curriculum by ID
// @access  Public
router.get('/:id', getCurriculumById);

// @route   PUT /api/curriculum/:id
// @desc    Update curriculum
// @access  Private (should be protected)
router.put('/:id', updateCurriculum);

// @route   DELETE /api/curriculum/:id
// @desc    Delete curriculum
// @access  Private (should be protected)
router.delete('/:id', deleteCurriculum);

// @route   POST /api/curriculum/:id/rating
// @desc    Add rating to curriculum
// @access  Private (should be protected)
router.post('/:id/rating', addRating);

module.exports = router;