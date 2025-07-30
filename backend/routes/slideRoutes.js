const express = require('express');
const router = express.Router();
const {
  generateSlides,
  getSlideDecks,
  getSlideDeckById,
  updateSlideDeck,
  deleteSlideDeck,
  addSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  exportSlideDeck,
  addRating,
  getPopularSlideDecks
} = require('../controllers/slideController');

router.post('/generate', generateSlides);
router.get('/', getSlideDecks);
router.get('/popular', getPopularSlideDecks);
router.get('/:id', getSlideDeckById);
router.put('/:id', updateSlideDeck);
router.delete('/:id', deleteSlideDeck);
router.post('/:id/slide', addSlide);
router.put('/:id/slide/:slideId', updateSlide);
router.delete('/:id/slide/:slideId', deleteSlide);
router.put('/:id/reorder', reorderSlides);
router.get('/:id/export', exportSlideDeck);
router.post('/:id/rating', addRating);

module.exports = router;