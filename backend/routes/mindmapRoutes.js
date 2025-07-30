const express = require('express');
const router = express.Router();
const {
  generateMindMap,
  getMindMaps,
  getMindMapById,
  getMindMapVisualization,
  updateMindMap,
  deleteMindMap,
  addNode,
  addEdge,
  removeNode,
  updateNodePosition,
  exportMindMap,
  addRating,
  getPopularMindMaps
} = require('../controllers/mindmapController');

router.post('/generate', generateMindMap);
router.get('/', getMindMaps);
router.get('/popular', getPopularMindMaps);
router.get('/:id', getMindMapById);
router.get('/:id/visualization', getMindMapVisualization);
router.put('/:id', updateMindMap);
router.delete('/:id', deleteMindMap);
router.post('/:id/node', addNode);
router.post('/:id/edge', addEdge);
router.delete('/:id/node/:nodeId', removeNode);
router.put('/:id/node/:nodeId/position', updateNodePosition);
router.get('/:id/export', exportMindMap);
router.post('/:id/rating', addRating);

module.exports = router;