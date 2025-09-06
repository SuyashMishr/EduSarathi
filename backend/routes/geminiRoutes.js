const express = require('express');
const router = express.Router();

// Deprecated: Gemini routes removed. Use /api/quiz, /api/curriculum, /api/mindmap, /api/grading, /api/translate
router.all('*', (_req, res) => {
  return res.status(410).json({
    success: false,
    message: 'Deprecated path. Please switch to the main endpoints under /api.'
  });
});

module.exports = router;
