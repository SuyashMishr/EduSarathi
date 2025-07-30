const express = require('express');
const router = express.Router();
const axios = require('axios');
const logger = require('../utils/logger');

// Gemini AI service configuration
const GEMINI_SERVICE_URL = process.env.GEMINI_SERVICE_URL || 'http://localhost:8001';
const GEMINI_SERVICE_TIMEOUT = parseInt(process.env.GEMINI_SERVICE_TIMEOUT) || 90000; // Increased to 90 seconds

// Create axios instance for Gemini service
const geminiAPI = axios.create({
  baseURL: GEMINI_SERVICE_URL,
  timeout: GEMINI_SERVICE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Generate quiz using Gemini AI
router.post('/quiz/generate', async (req, res) => {
  try {
    const {
      subject,
      topic,
      grade,
      questionCount = 10,
      difficulty = 'medium',
      questionTypes = ['mcq'],
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!subject || !topic || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Subject, topic, and grade are required'
      });
    }

    logger.info(`Generating Gemini quiz for ${subject} - ${topic} (Grade ${grade})`);

    const requestPayload = {
      subject,
      topic,
      grade: parseInt(grade),
      questionCount: parseInt(questionCount),
      difficulty,
      questionTypes,
      language
    };

    logger.info('Gemini request payload:', JSON.stringify(requestPayload));

    // Call Gemini AI service
    const response = await geminiAPI.post('/quiz/generate', requestPayload);

    const geminiResult = response.data;

    if (geminiResult.success) {
      res.status(200).json({
        success: true,
        message: 'Quiz generated successfully using Gemini AI',
        data: {
          ...geminiResult.data,
          metadata: {
            aiService: 'gemini',
            model: 'gemini-1.5-flash',
            ncertAligned: true,
            generatedAt: geminiResult.timestamp
          }
        }
      });
    } else {
      throw new Error(geminiResult.error || 'Gemini service returned error');
    }

  } catch (error) {
    logger.error('Error generating quiz with Gemini:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Gemini AI service is currently unavailable. Please try again later.'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Generate curriculum using Gemini AI
router.post('/curriculum/generate', async (req, res) => {
  try {
    const {
      subject,
      grade,
      duration = '1 semester',
      focus_areas
    } = req.body;

    if (!subject || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Subject and grade are required'
      });
    }

    logger.info(`Generating Gemini curriculum for ${subject} Grade ${grade}`);

    const response = await geminiAPI.post('/curriculum/generate', {
      subject,
      grade: parseInt(grade),
      duration,
      focus_areas
    });

    const geminiResult = response.data;

    if (geminiResult.success) {
      res.status(200).json({
        success: true,
        message: 'Curriculum generated successfully using Gemini AI',
        data: {
          ...geminiResult.data,
          metadata: {
            aiService: 'gemini',
            model: 'gemini-1.5-pro',
            ncertAligned: true,
            generatedAt: geminiResult.timestamp
          }
        }
      });
    } else {
      throw new Error(geminiResult.error || 'Gemini service returned error');
    }

  } catch (error) {
    logger.error('Error generating curriculum with Gemini:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate curriculum',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Grade answer using Gemini AI
router.post('/grading/evaluate', async (req, res) => {
  try {
    const {
      question,
      student_answer,
      correct_answer,
      subject,
      grade,
      max_points = 5
    } = req.body;

    if (!question || !student_answer || !correct_answer || !subject || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Question, student answer, correct answer, subject, and grade are required'
      });
    }

    logger.info(`Grading answer with Gemini for ${subject} Grade ${grade}`);

    const response = await geminiAPI.post('/grading/evaluate', {
      question,
      student_answer,
      correct_answer,
      subject,
      grade: parseInt(grade),
      max_points: parseInt(max_points)
    });

    const geminiResult = response.data;

    if (geminiResult.success) {
      res.status(200).json({
        success: true,
        message: 'Answer graded successfully using Gemini AI',
        data: {
          ...geminiResult.data,
          metadata: {
            aiService: 'gemini',
            model: 'gemini-1.5-flash',
            ncertAligned: true,
            gradedAt: geminiResult.timestamp
          }
        }
      });
    } else {
      throw new Error(geminiResult.error || 'Gemini service returned error');
    }

  } catch (error) {
    logger.error('Error grading with Gemini:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to grade answer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Generate content using Gemini AI
router.post('/content/generate', async (req, res) => {
  try {
    const {
      type,
      subject,
      topic,
      grade,
      additional_requirements
    } = req.body;

    if (!type || !subject || !topic || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Type, subject, topic, and grade are required'
      });
    }

    logger.info(`Generating ${type} content with Gemini for ${subject} - ${topic}`);

    const response = await geminiAPI.post('/content/generate', {
      type,
      subject,
      topic,
      grade: parseInt(grade),
      additional_requirements
    });

    const geminiResult = response.data;

    if (geminiResult.success) {
      res.status(200).json({
        success: true,
        message: 'Content generated successfully using Gemini AI',
        data: {
          ...geminiResult.data,
          metadata: {
            aiService: 'gemini',
            model: 'gemini-1.5-pro',
            ncertAligned: true,
            generatedAt: geminiResult.timestamp
          }
        }
      });
    } else {
      throw new Error(geminiResult.error || 'Gemini service returned error');
    }

  } catch (error) {
    logger.error('Error generating content with Gemini:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate content',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get NCERT subjects by grade
router.get('/ncert/subjects/:grade', async (req, res) => {
  try {
    const { grade } = req.params;

    if (!grade || isNaN(grade) || grade < 1 || grade > 12) {
      return res.status(400).json({
        success: false,
        message: 'Valid grade (1-12) is required'
      });
    }

    const response = await geminiAPI.get(`/ncert/subjects/${grade}`);
    const geminiResult = response.data;

    if (geminiResult.success) {
      res.status(200).json({
        success: true,
        message: 'NCERT subjects retrieved successfully',
        data: geminiResult.data
      });
    } else {
      throw new Error(geminiResult.error || 'Failed to retrieve subjects');
    }

  } catch (error) {
    logger.error('Error getting NCERT subjects:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve NCERT subjects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get NCERT chapters by grade and subject
router.get('/ncert/chapters/:grade/:subject', async (req, res) => {
  try {
    const { grade, subject } = req.params;

    if (!grade || isNaN(grade) || grade < 1 || grade > 12) {
      return res.status(400).json({
        success: false,
        message: 'Valid grade (1-12) is required'
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required'
      });
    }

    const response = await geminiAPI.get(`/ncert/chapters/${grade}/${subject}`);
    const geminiResult = response.data;

    if (geminiResult.success) {
      res.status(200).json({
        success: true,
        message: 'NCERT chapters retrieved successfully',
        data: geminiResult.data
      });
    } else {
      throw new Error(geminiResult.error || 'Failed to retrieve chapters');
    }

  } catch (error) {
    logger.error('Error getting NCERT chapters:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve NCERT chapters',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Batch quiz generation
router.post('/batch/quiz-generation', async (req, res) => {
  try {
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Array of quiz requests is required'
      });
    }

    if (requests.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 requests allowed per batch'
      });
    }

    logger.info(`Starting batch quiz generation for ${requests.length} requests`);

    const response = await geminiAPI.post('/batch/quiz-generation', requests);
    const geminiResult = response.data;

    if (geminiResult.success) {
      res.status(202).json({
        success: true,
        message: 'Batch quiz generation started',
        data: geminiResult.data
      });
    } else {
      throw new Error(geminiResult.error || 'Batch processing failed');
    }

  } catch (error) {
    logger.error('Error in batch quiz generation:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to start batch quiz generation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get system status
router.get('/system/status', async (req, res) => {
  try {
    const response = await geminiAPI.get('/system/status');
    const geminiResult = response.data;

    res.status(200).json({
      success: true,
      message: 'System status retrieved',
      data: {
        geminiService: geminiResult.success ? 'operational' : 'error',
        ...geminiResult.data,
        lastChecked: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error getting system status:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to get system status',
      data: {
        geminiService: 'unavailable',
        error: error.message,
        lastChecked: new Date().toISOString()
      }
    });
  }
});

// Health check for Gemini service
router.get('/health', async (req, res) => {
  try {
    const response = await geminiAPI.get('/health');
    
    res.status(200).json({
      success: true,
      message: 'Gemini service is healthy',
      data: response.data
    });

  } catch (error) {
    logger.error('Gemini service health check failed:', error.message);
    
    res.status(503).json({
      success: false,
      message: 'Gemini service is unavailable',
      error: error.message
    });
  }
});

module.exports = router;