const AnswerSheet = require('../models/AnswerSheet');
const Quiz = require('../models/Quiz');
const logger = require('../utils/logger');
const axios = require('axios');
const path = require('path');

// Upload answer sheet for grading
const uploadAnswerSheet = async (req, res) => {
  try {
    const { quizId, studentId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID is required'
      });
    }

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Create or update answer sheet
    let answerSheet = await AnswerSheet.findOne({
      student: studentId || req.user?.id || '000000000000000000000000',
      quiz: quizId,
      status: { $in: ['in_progress', 'submitted'] }
    });

    if (!answerSheet) {
      answerSheet = new AnswerSheet({
        student: studentId || req.user?.id || '000000000000000000000000',
        quiz: quizId,
        submission: {
          startTime: new Date(),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        },
        grading: {
          maxScore: quiz.totalPoints
        }
      });
    }

    // Add file information
    answerSheet.files.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    answerSheet.status = 'submitted';
    answerSheet.submission.endTime = new Date();

    const savedAnswerSheet = await answerSheet.save();

    logger.info(`Answer sheet uploaded: ${savedAnswerSheet._id}`);

    res.status(201).json({
      success: true,
      message: 'Answer sheet uploaded successfully',
      data: {
        answerSheetId: savedAnswerSheet._id,
        filename: req.file.filename,
        originalName: req.file.originalname
      }
    });

  } catch (error) {
    logger.error('Error uploading answer sheet:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload answer sheet'
    });
  }
};

// Grade answer sheet using AI
const gradeAnswerSheet = async (req, res) => {
  try {
    const { answerSheetId } = req.params;
    const { gradingCriteria, rubric } = req.body;

    const answerSheet = await AnswerSheet.findById(answerSheetId)
      .populate('quiz')
      .populate('student', 'name email');

    if (!answerSheet) {
      return res.status(404).json({
        success: false,
        message: 'Answer sheet not found'
      });
    }

    if (answerSheet.status === 'graded') {
      return res.status(400).json({
        success: false,
        message: 'Answer sheet has already been graded'
      });
    }

    logger.info(`Starting AI grading for answer sheet: ${answerSheetId}`);

    // Prepare data for AI grading service
    const gradingData = {
      answerSheetId: answerSheet._id,
      quiz: {
        questions: answerSheet.quiz.questions,
        totalPoints: answerSheet.quiz.totalPoints
      },
      files: answerSheet.files,
      gradingCriteria: gradingCriteria || {},
      rubric: rubric || {}
    };

    // Call AI grading service (OpenRouter-backed)
    let aiResponse;
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
      aiResponse = await axios.post(`${aiServiceUrl}/grading/evaluate`, {
        question: answerSheet.quiz.questions[0]?.question || 'General question',
        student_answer: gradingData.extractedText || 'No answer provided',
        correct_answer: answerSheet.quiz.questions[0]?.correctAnswer || 'No correct answer available',
        subject: answerSheet.quiz.subject || 'general',
        grade: answerSheet.quiz.grade || 10,
        max_points: answerSheet.quiz.totalPoints || 10
      }, {
        timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 60000
      });
    } catch (aiError) {
      logger.warn('AI grading service unavailable:', aiError.message);
      throw aiError;
    }

    const gradingResults = aiResponse.data.success ? aiResponse.data.data : aiResponse.data;

    // Update answer sheet with grading results
    answerSheet.answers = gradingResults.answers || [];
    answerSheet.grading.totalScore = gradingResults.totalScore || 0;
    answerSheet.grading.percentage = gradingResults.percentage || 0;
    answerSheet.grading.passed = gradingResults.passed || false;
    answerSheet.grading.grade = gradingResults.grade || 'F';

    // Add AI analysis data
    answerSheet.aiAnalysis = {
      confidence: gradingResults.confidence || 0,
      processingTime: gradingResults.processingTime || 0,
      model: gradingResults.model || 'unknown',
      extractedText: gradingResults.extractedText || '',
      detectedLanguage: gradingResults.detectedLanguage || 'en',
      qualityScore: gradingResults.qualityScore || 0
    };

    // Add feedback
    answerSheet.feedback = {
      overall: gradingResults.feedback?.overall || '',
      strengths: gradingResults.feedback?.strengths || [],
      improvements: gradingResults.feedback?.improvements || [],
      suggestions: gradingResults.feedback?.suggestions || []
    };

    // Set flags if needed
    if (gradingResults.confidence < 0.7) {
      answerSheet.flags.needsReview = true;
    }

    await answerSheet.completeGrading(null, 'ai');

    logger.info(`Answer sheet graded successfully: ${answerSheetId}`);

    res.status(200).json({
      success: true,
      message: 'Answer sheet graded successfully',
      data: {
        answerSheetId: answerSheet._id,
        grading: answerSheet.grading,
        feedback: answerSheet.feedback,
        aiAnalysis: answerSheet.aiAnalysis,
        needsReview: answerSheet.flags.needsReview
      }
    });

  } catch (error) {
    logger.error('Error grading answer sheet:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI grading service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to grade answer sheet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get grading results
const getGradingResults = async (req, res) => {
  try {
    const { answerSheetId } = req.params;

    const answerSheet = await AnswerSheet.findById(answerSheetId)
      .populate('quiz', 'title subject topic questions')
      .populate('student', 'name email')
      .populate('grading.gradedBy', 'name email');

    if (!answerSheet) {
      return res.status(404).json({
        success: false,
        message: 'Answer sheet not found'
      });
    }

    // Prepare detailed results
    const detailedResults = answerSheet.answers.map((answer, index) => {
      const question = answerSheet.quiz.questions[index];
      return {
        questionId: answer.questionId,
        question: question?.question || answer.questionText,
        answer: answer.answer,
        answerImage: answer.answerImage,
        score: answer.score,
        maxScore: answer.maxScore,
        feedback: answer.feedback,
        rubric: answer.rubric,
        gradingStatus: answer.gradingStatus
      };
    });

    res.status(200).json({
      success: true,
      data: {
        answerSheet: {
          id: answerSheet._id,
          status: answerSheet.status,
          attempt: answerSheet.attempt,
          submission: answerSheet.submission,
          grading: answerSheet.grading,
          feedback: answerSheet.feedback,
          aiAnalysis: answerSheet.aiAnalysis,
          flags: answerSheet.flags
        },
        quiz: {
          title: answerSheet.quiz.title,
          subject: answerSheet.quiz.subject,
          topic: answerSheet.quiz.topic
        },
        student: answerSheet.student,
        results: detailedResults,
        files: answerSheet.files
      }
    });

  } catch (error) {
    logger.error('Error fetching grading results:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grading results'
    });
  }
};

// Manual review and update grading
const reviewGrading = async (req, res) => {
  try {
    const { answerSheetId } = req.params;
    const { answers, overallFeedback, reviewerComments } = req.body;
    const reviewerId = req.user?.id || '000000000000000000000000';

    const answerSheet = await AnswerSheet.findById(answerSheetId);

    if (!answerSheet) {
      return res.status(404).json({
        success: false,
        message: 'Answer sheet not found'
      });
    }

    // Update individual answer scores and feedback
    if (answers && Array.isArray(answers)) {
      answers.forEach((updatedAnswer, index) => {
        if (answerSheet.answers[index]) {
          answerSheet.answers[index].score = updatedAnswer.score || answerSheet.answers[index].score;
          answerSheet.answers[index].feedback = updatedAnswer.feedback || answerSheet.answers[index].feedback;
          answerSheet.answers[index].gradingStatus = 'manually_graded';
        }
      });
    }

    // Update overall feedback
    if (overallFeedback) {
      answerSheet.feedback.overall = overallFeedback;
    }

    // Add reviewer comments
    if (reviewerComments) {
      answerSheet.feedback.reviewerComments = reviewerComments;
    }

    // Recalculate total score
    answerSheet.grading.totalScore = answerSheet.answers.reduce((total, answer) => total + (answer.score || 0), 0);
    
    // Update grading information
    answerSheet.grading.gradedBy = reviewerId;
    answerSheet.grading.gradedAt = new Date();
    answerSheet.grading.gradingMethod = 'manual';
    answerSheet.status = 'reviewed';
    answerSheet.flags.needsReview = false;

    await answerSheet.save();

    logger.info(`Answer sheet reviewed: ${answerSheetId} by ${reviewerId}`);

    res.status(200).json({
      success: true,
      message: 'Grading reviewed and updated successfully',
      data: {
        answerSheetId: answerSheet._id,
        grading: answerSheet.grading,
        feedback: answerSheet.feedback
      }
    });

  } catch (error) {
    logger.error('Error reviewing grading:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to review grading'
    });
  }
};

// Get answer sheets that need review
const getAnswerSheetsForReview = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      grade,
      needsReview = true
    } = req.query;

    // Build filter
    const filter = {
      status: { $in: ['graded', 'submitted'] }
    };

    if (needsReview === 'true') {
      filter['flags.needsReview'] = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const answerSheets = await AnswerSheet.find(filter)
      .populate('quiz', 'title subject topic grade')
      .populate('student', 'name email')
      .populate('grading.gradedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AnswerSheet.countDocuments(filter);

    // Filter by subject and grade if provided
    let filteredSheets = answerSheets;
    if (subject) {
      filteredSheets = filteredSheets.filter(sheet => 
        sheet.quiz.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }
    if (grade) {
      filteredSheets = filteredSheets.filter(sheet => 
        sheet.quiz.grade === grade
      );
    }

    res.status(200).json({
      success: true,
      data: {
        answerSheets: filteredSheets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching answer sheets for review:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch answer sheets for review'
    });
  }
};

// Get grading statistics
const getGradingStats = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Overall statistics
    const overallStats = await AnswerSheet.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['graded', 'reviewed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalGraded: { $sum: 1 },
          averageScore: { $avg: '$grading.percentage' },
          averageProcessingTime: { $avg: '$aiAnalysis.processingTime' },
          needsReviewCount: {
            $sum: { $cond: ['$flags.needsReview', 1, 0] }
          },
          aiGradedCount: {
            $sum: { $cond: [{ $eq: ['$grading.gradingMethod', 'ai'] }, 1, 0] }
          },
          manualGradedCount: {
            $sum: { $cond: [{ $eq: ['$grading.gradingMethod', 'manual'] }, 1, 0] }
          }
        }
      }
    ]);

    // Subject-wise statistics
    const subjectStats = await AnswerSheet.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['graded', 'reviewed'] }
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }
      },
      { $unwind: '$quizData' },
      {
        $group: {
          _id: '$quizData.subject',
          count: { $sum: 1 },
          averageScore: { $avg: '$grading.percentage' },
          averageConfidence: { $avg: '$aiAnalysis.confidence' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Daily grading trend
    const dailyTrend = await AnswerSheet.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['graded', 'reviewed'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          averageScore: { $avg: '$grading.percentage' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        timeframe,
        overview: overallStats[0] || {
          totalGraded: 0,
          averageScore: 0,
          averageProcessingTime: 0,
          needsReviewCount: 0,
          aiGradedCount: 0,
          manualGradedCount: 0
        },
        bySubject: subjectStats,
        dailyTrend
      }
    });

  } catch (error) {
    logger.error('Error fetching grading stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grading statistics'
    });
  }
};

module.exports = {
  uploadAnswerSheet,
  gradeAnswerSheet,
  getGradingResults,
  reviewGrading,
  getAnswerSheetsForReview,
  getGradingStats
};