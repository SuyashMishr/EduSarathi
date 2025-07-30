const SlideDeck = require('../models/Slide');
const logger = require('../utils/logger');
const axios = require('axios');

// Generate slide deck using AI
const generateSlides = async (req, res) => {
  try {
    const {
      subject,
      topic,
      grade,
      slideCount = 10,
      theme = 'default',
      template = 'education',
      difficulty = 'intermediate',
      language = 'en',
      includeImages = false
    } = req.body;

    // Validate required fields
    if (!subject || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Subject and topic are required'
      });
    }

    logger.info(`Generating slides for ${subject} - ${topic}`);

    // Call AI service to generate slides
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/slides/generate`, {
      subject,
      topic,
      grade,
      slideCount,
      theme,
      template,
      difficulty,
      language,
      includeImages
    }, {
      timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 60000
    });

    const generatedSlides = aiResponse.data;

    // Create slide deck in database
    const slideDeck = new SlideDeck({
      title: generatedSlides.title || `${topic} - ${subject}`,
      description: generatedSlides.description,
      subject,
      topic,
      grade,
      slides: generatedSlides.slides || [],
      settings: {
        theme,
        template,
        fontFamily: 'Arial',
        fontSize: 16,
        primaryColor: '#007bff',
        secondaryColor: '#6c757d'
      },
      duration: {
        estimated: generatedSlides.estimatedDuration || slideCount * 2 // 2 minutes per slide
      },
      difficulty,
      language,
      tags: generatedSlides.tags || [subject.toLowerCase(), topic.toLowerCase()],
      createdBy: req.user?.id || '000000000000000000000000',
      metadata: {
        aiGenerated: true,
        model: generatedSlides.model || 'gpt-3.5-turbo',
        generationTime: generatedSlides.generationTime || 0
      }
    });

    const savedSlideDeck = await slideDeck.save();

    logger.info(`Slide deck generated successfully: ${savedSlideDeck._id}`);

    res.status(201).json({
      success: true,
      message: 'Slide deck generated successfully',
      data: savedSlideDeck
    });

  } catch (error) {
    logger.error('Error generating slides:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate slides',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all slide decks
const getSlideDecks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      topic,
      grade,
      difficulty,
      status = 'published',
      search
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (topic) filter.topic = new RegExp(topic, 'i');
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const slideDecks = await SlideDeck.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SlideDeck.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        slideDecks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching slide decks:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slide decks'
    });
  }
};

// Get slide deck by ID
const getSlideDeckById = async (req, res) => {
  try {
    const { id } = req.params;

    const slideDeck = await SlideDeck.findById(id)
      .populate('createdBy', 'name email')
      .populate('usage.ratings.user', 'name');

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    // Increment views
    await slideDeck.incrementViews();

    res.status(200).json({
      success: true,
      data: slideDeck
    });

  } catch (error) {
    logger.error('Error fetching slide deck:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slide deck'
    });
  }
};

// Update slide deck
const updateSlideDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates.usage;
    delete updates.metadata;

    const slideDeck = await SlideDeck.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    logger.info(`Slide deck updated: ${slideDeck._id}`);

    res.status(200).json({
      success: true,
      message: 'Slide deck updated successfully',
      data: slideDeck
    });

  } catch (error) {
    logger.error('Error updating slide deck:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update slide deck'
    });
  }
};

// Delete slide deck
const deleteSlideDeck = async (req, res) => {
  try {
    const { id } = req.params;

    const slideDeck = await SlideDeck.findByIdAndDelete(id);

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    logger.info(`Slide deck deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Slide deck deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting slide deck:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slide deck'
    });
  }
};

// Add slide to deck
const addSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slideData = req.body;

    const slideDeck = await SlideDeck.findById(id);

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    await slideDeck.addSlide(slideData);

    res.status(201).json({
      success: true,
      message: 'Slide added successfully',
      data: slideDeck
    });

  } catch (error) {
    logger.error('Error adding slide:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add slide'
    });
  }
};

// Update specific slide
const updateSlide = async (req, res) => {
  try {
    const { id, slideId } = req.params;
    const slideUpdates = req.body;

    const slideDeck = await SlideDeck.findById(id);

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    const slide = slideDeck.slides.id(slideId);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    // Update slide properties
    Object.assign(slide, slideUpdates);

    await slideDeck.save();

    res.status(200).json({
      success: true,
      message: 'Slide updated successfully',
      data: slide
    });

  } catch (error) {
    logger.error('Error updating slide:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update slide'
    });
  }
};

// Delete slide from deck
const deleteSlide = async (req, res) => {
  try {
    const { id, slideId } = req.params;

    const slideDeck = await SlideDeck.findById(id);

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    slideDeck.slides.id(slideId).remove();
    await slideDeck.save();

    res.status(200).json({
      success: true,
      message: 'Slide deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting slide:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slide'
    });
  }
};

// Reorder slides
const reorderSlides = async (req, res) => {
  try {
    const { id } = req.params;
    const { slideOrder } = req.body;

    if (!Array.isArray(slideOrder)) {
      return res.status(400).json({
        success: false,
        message: 'Slide order must be an array'
      });
    }

    const slideDeck = await SlideDeck.findById(id);

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    await slideDeck.reorderSlides(slideOrder);

    res.status(200).json({
      success: true,
      message: 'Slides reordered successfully',
      data: slideDeck
    });

  } catch (error) {
    logger.error('Error reordering slides:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder slides'
    });
  }
};

// Export slide deck
const exportSlideDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'pdf' } = req.query;

    const slideDeck = await SlideDeck.findById(id);

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    // Call AI service to export slides
    const exportResponse = await axios.post(`${process.env.AI_SERVICE_URL}/slides/export`, {
      slideDeckId: id,
      format,
      slides: slideDeck.slides,
      settings: slideDeck.settings
    }, {
      timeout: 120000 // 2 minutes for export
    });

    const exportResult = exportResponse.data;

    // Update export record
    await slideDeck.exportSlides(format);

    res.status(200).json({
      success: true,
      message: 'Slide deck exported successfully',
      data: {
        downloadUrl: exportResult.downloadUrl,
        format,
        size: exportResult.size,
        expiresAt: exportResult.expiresAt
      }
    });

  } catch (error) {
    logger.error('Error exporting slide deck:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to export slide deck'
    });
  }
};

// Add rating to slide deck
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

    const slideDeck = await SlideDeck.findById(id);

    if (!slideDeck) {
      return res.status(404).json({
        success: false,
        message: 'Slide deck not found'
      });
    }

    await slideDeck.addRating(userId, rating, comment);

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: slideDeck.averageRating,
        totalRatings: slideDeck.usage.ratings.length
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

// Get popular slide decks
const getPopularSlideDecks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const slideDecks = await SlideDeck.getPopular(parseInt(limit));

    res.status(200).json({
      success: true,
      data: slideDecks
    });

  } catch (error) {
    logger.error('Error fetching popular slide decks:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular slide decks'
    });
  }
};

module.exports = {
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
};