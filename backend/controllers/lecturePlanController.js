const LecturePlan = require('../models/LecturePlan');
const logger = require('../utils/logger');
const axios = require('axios');

// Generate lecture plan using AI
const generateLecturePlan = async (req, res) => {
  try {
    const {
      subject,
      topic,
      grade,
      duration = 60, // in minutes
      learningObjectives = [],
      difficulty = 'intermediate',
      teachingStrategies = [],
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!subject || !topic || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Subject, topic, and grade are required'
      });
    }

    logger.info(`Generating lecture plan for ${subject} - ${topic} (Grade ${grade})`);

    // Call AI service to generate lecture plan
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/lecture-plan/generate`, {
      subject,
      topic,
      grade,
      duration,
      learningObjectives,
      difficulty,
      teachingStrategies,
      language
    }, {
      timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 60000
    });

    const generatedPlan = aiResponse.data;

    // Create lecture plan in database
    const lecturePlan = new LecturePlan({
      title: generatedPlan.title || `${topic} - ${subject} Lesson Plan`,
      description: generatedPlan.description,
      subject,
      topic,
      grade,
      duration: {
        total: duration,
        breakdown: generatedPlan.durationBreakdown || {
          introduction: Math.round(duration * 0.1),
          mainContent: Math.round(duration * 0.7),
          activities: Math.round(duration * 0.15),
          conclusion: Math.round(duration * 0.05)
        }
      },
      learningObjectives: generatedPlan.learningObjectives || learningObjectives,
      prerequisites: generatedPlan.prerequisites || [],
      keyVocabulary: generatedPlan.keyVocabulary || [],
      activities: generatedPlan.activities || [],
      resources: generatedPlan.resources || [],
      assessments: generatedPlan.assessments || [],
      structure: generatedPlan.structure || {},
      teachingStrategies: generatedPlan.teachingStrategies || [],
      differentiation: generatedPlan.differentiation || {},
      technology: generatedPlan.technology || [],
      safety: generatedPlan.safety || {},
      standards: generatedPlan.standards || [],
      difficulty,
      language,
      tags: generatedPlan.tags || [subject.toLowerCase(), topic.toLowerCase(), grade.toLowerCase()],
      createdBy: req.user?.id || '000000000000000000000000',
      metadata: {
        aiGenerated: true,
        model: generatedPlan.model || 'gpt-3.5-turbo',
        generationTime: generatedPlan.generationTime || 0
      }
    });

    const savedLecturePlan = await lecturePlan.save();

    logger.info(`Lecture plan generated successfully: ${savedLecturePlan._id}`);

    res.status(201).json({
      success: true,
      message: 'Lecture plan generated successfully',
      data: savedLecturePlan
    });

  } catch (error) {
    logger.error('Error generating lecture plan:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate lecture plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all lecture plans
const getLecturePlans = async (req, res) => {
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

    const lecturePlans = await LecturePlan.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LecturePlan.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        lecturePlans,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching lecture plans:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lecture plans'
    });
  }
};

// Get lecture plan by ID
const getLecturePlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const lecturePlan = await LecturePlan.findById(id)
      .populate('createdBy', 'name email')
      .populate('usage.ratings.user', 'name')
      .populate('usage.feedback.user', 'name');

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lecturePlan
    });

  } catch (error) {
    logger.error('Error fetching lecture plan:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lecture plan'
    });
  }
};

// Update lecture plan
const updateLecturePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates.usage;
    delete updates.metadata;

    const lecturePlan = await LecturePlan.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    logger.info(`Lecture plan updated: ${lecturePlan._id}`);

    res.status(200).json({
      success: true,
      message: 'Lecture plan updated successfully',
      data: lecturePlan
    });

  } catch (error) {
    logger.error('Error updating lecture plan:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update lecture plan'
    });
  }
};

// Delete lecture plan
const deleteLecturePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const lecturePlan = await LecturePlan.findByIdAndDelete(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    logger.info(`Lecture plan deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Lecture plan deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting lecture plan:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lecture plan'
    });
  }
};

// Add activity to lecture plan
const addActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activityData = req.body;

    const lecturePlan = await LecturePlan.findById(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    await lecturePlan.addActivity(activityData);

    res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      data: lecturePlan
    });

  } catch (error) {
    logger.error('Error adding activity:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add activity'
    });
  }
};

// Add resource to lecture plan
const addResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceData = req.body;

    const lecturePlan = await LecturePlan.findById(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    await lecturePlan.addResource(resourceData);

    res.status(201).json({
      success: true,
      message: 'Resource added successfully',
      data: lecturePlan
    });

  } catch (error) {
    logger.error('Error adding resource:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add resource'
    });
  }
};

// Add assessment to lecture plan
const addAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentData = req.body;

    const lecturePlan = await LecturePlan.findById(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    await lecturePlan.addAssessment(assessmentData);

    res.status(201).json({
      success: true,
      message: 'Assessment added successfully',
      data: lecturePlan
    });

  } catch (error) {
    logger.error('Error adding assessment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add assessment'
    });
  }
};

// Record implementation of lecture plan
const recordImplementation = async (req, res) => {
  try {
    const { id } = req.params;
    const implementationData = req.body;

    const lecturePlan = await LecturePlan.findById(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    await lecturePlan.recordImplementation(implementationData);

    res.status(200).json({
      success: true,
      message: 'Implementation recorded successfully',
      data: {
        implementations: lecturePlan.usage.implementations,
        implementation: lecturePlan.implementation
      }
    });

  } catch (error) {
    logger.error('Error recording implementation:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to record implementation'
    });
  }
};

// Add rating to lecture plan
const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, effectiveness, engagement } = req.body;
    const userId = req.user?.id || '000000000000000000000000';

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const lecturePlan = await LecturePlan.findById(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    await lecturePlan.addRating(userId, {
      rating,
      comment,
      effectiveness,
      engagement
    });

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: lecturePlan.averageRating,
        totalRatings: lecturePlan.usage.ratings.length
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

// Add feedback to lecture plan
const addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, content } = req.body;
    const userId = req.user?.id || '000000000000000000000000';

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        message: 'Feedback type and content are required'
      });
    }

    const lecturePlan = await LecturePlan.findById(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    await lecturePlan.addFeedback(userId, type, content);

    res.status(201).json({
      success: true,
      message: 'Feedback added successfully'
    });

  } catch (error) {
    logger.error('Error adding feedback:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add feedback'
    });
  }
};

// Get lecture plan summary
const getLecturePlanSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const lecturePlan = await LecturePlan.findById(id);

    if (!lecturePlan) {
      return res.status(404).json({
        success: false,
        message: 'Lecture plan not found'
      });
    }

    const summary = lecturePlan.getSummary();

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('Error fetching lecture plan summary:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lecture plan summary'
    });
  }
};

// Get popular lecture plans
const getPopularLecturePlans = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const lecturePlans = await LecturePlan.getPopular(parseInt(limit));

    res.status(200).json({
      success: true,
      data: lecturePlans
    });

  } catch (error) {
    logger.error('Error fetching popular lecture plans:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular lecture plans'
    });
  }
};

// Search lecture plans by standards
const searchByStandards = async (req, res) => {
  try {
    const { framework, codes } = req.query;

    if (!framework || !codes) {
      return res.status(400).json({
        success: false,
        message: 'Framework and codes are required'
      });
    }

    const codeArray = Array.isArray(codes) ? codes : codes.split(',');
    const lecturePlans = await LecturePlan.findByStandards(framework, codeArray);

    res.status(200).json({
      success: true,
      data: lecturePlans
    });

  } catch (error) {
    logger.error('Error searching by standards:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search by standards'
    });
  }
};

module.exports = {
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
};