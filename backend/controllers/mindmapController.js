const MindMap = require('../models/MindMap');
const logger = require('../utils/logger');
const axios = require('axios');

// Generate mind map using AI
const generateMindMap = async (req, res) => {
  try {
    const {
      subject,
      topic,
      grade,
      complexity = 'moderate',
      layout = 'hierarchical',
      theme = 'default',
      difficulty = 'intermediate',
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!subject || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Subject and topic are required'
      });
    }

    logger.info(`Generating mind map for ${subject} - ${topic}`);

    // Call AI service to generate mind map
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/mindmap/generate`, {
      subject,
      topic,
      grade,
      complexity,
      layout,
      theme,
      difficulty,
      language
    }, {
      timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 60000
    });

    const generatedMindMap = aiResponse.data;

    // Create mind map in database
    const mindMap = new MindMap({
      title: generatedMindMap.title || `${topic} Mind Map`,
      description: generatedMindMap.description,
      subject,
      topic,
      grade,
      nodes: generatedMindMap.nodes || [],
      edges: generatedMindMap.edges || [],
      layout: {
        type: layout,
        direction: 'top-bottom',
        spacing: {
          horizontal: 100,
          vertical: 80
        }
      },
      style: {
        theme,
        fontFamily: 'Arial',
        backgroundColor: '#ffffff',
        gridEnabled: false
      },
      settings: {
        isInteractive: true,
        showLabels: true,
        allowEditing: true,
        autoLayout: true,
        zoomEnabled: true
      },
      difficulty,
      language,
      tags: generatedMindMap.tags || [subject.toLowerCase(), topic.toLowerCase()],
      createdBy: req.user?.id || '000000000000000000000000',
      metadata: {
        aiGenerated: true,
        model: generatedMindMap.model || 'gpt-3.5-turbo',
        generationTime: generatedMindMap.generationTime || 0,
        complexity
      }
    });

    const savedMindMap = await mindMap.save();

    logger.info(`Mind map generated successfully: ${savedMindMap._id}`);

    res.status(201).json({
      success: true,
      message: 'Mind map generated successfully',
      data: savedMindMap
    });

  } catch (error) {
    logger.error('Error generating mind map:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate mind map',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all mind maps
const getMindMaps = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      topic,
      grade,
      difficulty,
      complexity,
      status = 'published',
      search
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (topic) filter.topic = new RegExp(topic, 'i');
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;
    if (complexity) filter['metadata.complexity'] = complexity;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mindMaps = await MindMap.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MindMap.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        mindMaps,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching mind maps:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mind maps'
    });
  }
};

// Get mind map by ID
const getMindMapById = async (req, res) => {
  try {
    const { id } = req.params;

    const mindMap = await MindMap.findById(id)
      .populate('createdBy', 'name email')
      .populate('usage.ratings.user', 'name');

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    // Increment views
    await mindMap.incrementViews();

    res.status(200).json({
      success: true,
      data: mindMap
    });

  } catch (error) {
    logger.error('Error fetching mind map:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mind map'
    });
  }
};

// Get mind map visualization data
const getMindMapVisualization = async (req, res) => {
  try {
    const { id } = req.params;

    const mindMap = await MindMap.findById(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    const visualizationData = mindMap.getVisualizationData();

    // Increment interactions
    await mindMap.incrementInteractions();

    res.status(200).json({
      success: true,
      data: visualizationData
    });

  } catch (error) {
    logger.error('Error fetching mind map visualization:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mind map visualization'
    });
  }
};

// Update mind map
const updateMindMap = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates.usage;
    delete updates.metadata;

    const mindMap = await MindMap.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    logger.info(`Mind map updated: ${mindMap._id}`);

    res.status(200).json({
      success: true,
      message: 'Mind map updated successfully',
      data: mindMap
    });

  } catch (error) {
    logger.error('Error updating mind map:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update mind map'
    });
  }
};

// Delete mind map
const deleteMindMap = async (req, res) => {
  try {
    const { id } = req.params;

    const mindMap = await MindMap.findByIdAndDelete(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    logger.info(`Mind map deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Mind map deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting mind map:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mind map'
    });
  }
};

// Add node to mind map
const addNode = async (req, res) => {
  try {
    const { id } = req.params;
    const nodeData = req.body;

    const mindMap = await MindMap.findById(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    await mindMap.addNode(nodeData);

    res.status(201).json({
      success: true,
      message: 'Node added successfully',
      data: mindMap
    });

  } catch (error) {
    logger.error('Error adding node:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add node'
    });
  }
};

// Add edge to mind map
const addEdge = async (req, res) => {
  try {
    const { id } = req.params;
    const { source, target, ...edgeData } = req.body;

    if (!source || !target) {
      return res.status(400).json({
        success: false,
        message: 'Source and target nodes are required'
      });
    }

    const mindMap = await MindMap.findById(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    await mindMap.addEdge(source, target, edgeData);

    res.status(201).json({
      success: true,
      message: 'Edge added successfully',
      data: mindMap
    });

  } catch (error) {
    logger.error('Error adding edge:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add edge'
    });
  }
};

// Remove node from mind map
const removeNode = async (req, res) => {
  try {
    const { id, nodeId } = req.params;

    const mindMap = await MindMap.findById(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    await mindMap.removeNode(nodeId);

    res.status(200).json({
      success: true,
      message: 'Node removed successfully',
      data: mindMap
    });

  } catch (error) {
    logger.error('Error removing node:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to remove node'
    });
  }
};

// Update node position
const updateNodePosition = async (req, res) => {
  try {
    const { id, nodeId } = req.params;
    const { x, y } = req.body;

    if (typeof x !== 'number' || typeof y !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid x and y coordinates are required'
      });
    }

    const mindMap = await MindMap.findById(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    await mindMap.updateNodePosition(nodeId, x, y);

    res.status(200).json({
      success: true,
      message: 'Node position updated successfully'
    });

  } catch (error) {
    logger.error('Error updating node position:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update node position'
    });
  }
};

// Export mind map
const exportMindMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'png' } = req.query;

    const mindMap = await MindMap.findById(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    // Call AI service to export mind map
    const exportResponse = await axios.post(`${process.env.AI_SERVICE_URL}/mindmap/export`, {
      mindMapId: id,
      format,
      visualizationData: mindMap.getVisualizationData()
    }, {
      timeout: 120000 // 2 minutes for export
    });

    const exportResult = exportResponse.data;

    // Update export record
    mindMap.exports.push({
      format,
      url: exportResult.downloadUrl,
      size: exportResult.size
    });
    await mindMap.save();

    res.status(200).json({
      success: true,
      message: 'Mind map exported successfully',
      data: {
        downloadUrl: exportResult.downloadUrl,
        format,
        size: exportResult.size,
        expiresAt: exportResult.expiresAt
      }
    });

  } catch (error) {
    logger.error('Error exporting mind map:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to export mind map'
    });
  }
};

// Add rating to mind map
const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id || '000000000000000000000000';

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const mindMap = await MindMap.findById(id);

    if (!mindMap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    await mindMap.addRating(userId, rating, comment);

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: mindMap.averageRating,
        totalRatings: mindMap.usage.ratings.length
      }
    });

  } catch (error) {
    logger.error('Error adding rating:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating'
    });
  }
};

// Get popular mind maps
const getPopularMindMaps = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const mindMaps = await MindMap.getPopular(parseInt(limit));

    res.status(200).json({
      success: true,
      data: mindMaps
    });

  } catch (error) {
    logger.error('Error fetching popular mind maps:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular mind maps'
    });
  }
};

module.exports = {
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
};