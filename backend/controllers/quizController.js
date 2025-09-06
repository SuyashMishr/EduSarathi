const Quiz = require('../models/Quiz');
const AnswerSheet = require('../models/AnswerSheet');
const logger = require('../utils/logger');
const axios = require('axios');

// Generate quiz using AI
const generateQuiz = async (req, res) => {
  try {
    const {
      subject,
      topic,
      grade,
      questionCount = 10,
      questionTypes = ['mcq'],
      difficulty = 'medium',
      timeLimit = 30,
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!subject || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Subject and topic are required'
      });
    }

    logger.info(`Generating quiz for ${subject} - ${topic}`);

    // Call AI service (OpenRouter-backed) to generate quiz
    let aiResponse;
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
      aiResponse = await axios.post(`${aiServiceUrl}/quiz/generate`, {
        subject,
        topic,
        grade: parseInt(grade),
        questionCount: parseInt(questionCount),
        questionTypes,
        difficulty,
        language
      }, {
        timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 60000
      });
    } catch (aiError) {
      logger.warn('Primary AI service unavailable:', aiError.message);
      
      throw aiError;
    }

    const generatedQuiz = aiResponse.data.success ? aiResponse.data.data : aiResponse.data;

    // Create quiz in database
    const quiz = new Quiz({
      title: generatedQuiz.title || `${topic} Quiz`,
      description: generatedQuiz.description,
      subject,
      topic,
      grade,
      questions: generatedQuiz.questions || [],
      settings: {
        timeLimit,
        attemptsAllowed: 1,
        shuffleQuestions: false,
        shuffleOptions: false,
        showResults: 'after_submission',
        passingScore: 60
      },
      difficulty,
      language,
      tags: generatedQuiz.tags || [subject.toLowerCase(), topic.toLowerCase()],
      createdBy: req.user?.id || '000000000000000000000000',
      metadata: {
        aiGenerated: true,
  model: generatedQuiz.model || aiResponse.data.model || 'openrouter-default',
        generationTime: generatedQuiz.generationTime || 0,
  ncertAligned: generatedQuiz.ncert_alignment || aiResponse.data.ncert_aligned || false,
  aiService: 'openrouter'
      }
    });

    const savedQuiz = await quiz.save();

    logger.info(`Quiz generated successfully: ${savedQuiz._id}`);

    res.status(201).json({
      success: true,
      message: 'Quiz generated successfully',
      data: savedQuiz
    });

  } catch (error) {
    logger.error('Error generating quiz:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all quizzes
const getQuizzes = async (req, res) => {
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

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name email')
      .select('-questions.correctAnswer -questions.explanation') // Hide answers in list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quiz.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        quizzes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching quizzes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes'
    });
  }
};

// Get quiz by ID (for taking quiz)
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const { forStudent = false } = req.query;

    const quiz = await Quiz.findById(id)
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Return student version (without answers) or full version
    const responseData = forStudent === 'true' ? quiz.getStudentVersion() : quiz;

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    logger.error('Error fetching quiz:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz'
    });
  }
};

// Start quiz attempt
const startQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || '000000000000000000000000';

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if student has already attempted this quiz
    const existingAttempts = await AnswerSheet.countDocuments({
      student: studentId,
      quiz: id,
      status: { $in: ['submitted', 'graded'] }
    });

    if (existingAttempts >= quiz.settings.attemptsAllowed) {
      return res.status(400).json({
        success: false,
        message: 'Maximum attempts reached for this quiz'
      });
    }

    // Create new answer sheet
    const answerSheet = new AnswerSheet({
      student: studentId,
      quiz: id,
      submission: {
        startTime: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      },
      grading: {
        maxScore: quiz.totalPoints
      },
      attempt: existingAttempts + 1
    });

    const savedAnswerSheet = await answerSheet.save();

    logger.info(`Quiz attempt started: ${savedAnswerSheet._id}`);

    res.status(201).json({
      success: true,
      message: 'Quiz attempt started',
      data: {
        answerSheetId: savedAnswerSheet._id,
        quiz: quiz.getStudentVersion(),
        timeLimit: quiz.settings.timeLimit,
        startTime: savedAnswerSheet.submission.startTime
      }
    });

  } catch (error) {
    logger.error('Error starting quiz attempt:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to start quiz attempt'
    });
  }
};

// Submit quiz answers
const submitQuizAnswers = async (req, res) => {
  try {
    const { id } = req.params; // Quiz ID
    const { answerSheetId, answers } = req.body;

    const answerSheet = await AnswerSheet.findById(answerSheetId)
      .populate('quiz');

    if (!answerSheet) {
      return res.status(404).json({
        success: false,
        message: 'Answer sheet not found'
      });
    }

    if (answerSheet.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Quiz has already been submitted'
      });
    }

    // Update answers
    answerSheet.answers = answers.map((answer, index) => ({
      questionId: answerSheet.quiz.questions[index]._id,
      questionText: answerSheet.quiz.questions[index].question,
      answer: answer,
      maxScore: answerSheet.quiz.questions[index].points
    }));

    // Submit the answer sheet
    await answerSheet.submit();

    // Calculate score using quiz method
    const scoreResult = answerSheet.quiz.calculateScore(answers);

    // Update grading information
    answerSheet.grading.totalScore = scoreResult.totalScore;
    answerSheet.grading.percentage = scoreResult.percentage;
    answerSheet.grading.passed = scoreResult.passed;

    // Update individual answer scores
    answerSheet.answers.forEach((answer, index) => {
      const question = answerSheet.quiz.questions[index];
      let isCorrect = false;

      switch (question.type) {
        case 'mcq':
        case 'true_false':
          isCorrect = answers[index] === question.correctAnswer;
          break;
        case 'short_answer':
        case 'fill_blank':
          isCorrect = answers[index] && 
            answers[index].toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          break;
      }

      answer.score = isCorrect ? question.points : 0;
      answer.gradingStatus = 'ai_graded';
    });

    await answerSheet.completeGrading(null, 'ai');

    // Update quiz usage statistics
    await Quiz.findByIdAndUpdate(id, {
      $inc: { 'usage.attempts': 1 }
    });

    logger.info(`Quiz submitted and graded: ${answerSheetId}`);

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score: scoreResult,
        answerSheet: answerSheet._id,
        showResults: answerSheet.quiz.settings.showResults !== 'never'
      }
    });

  } catch (error) {
    logger.error('Error submitting quiz:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz'
    });
  }
};

// Get quiz results
const getQuizResults = async (req, res) => {
  try {
    const { answerSheetId } = req.params;

    const answerSheet = await AnswerSheet.findById(answerSheetId)
      .populate('quiz')
      .populate('student', 'name email');

    if (!answerSheet) {
      return res.status(404).json({
        success: false,
        message: 'Answer sheet not found'
      });
    }

    if (answerSheet.status !== 'graded') {
      return res.status(400).json({
        success: false,
        message: 'Quiz results are not yet available'
      });
    }

    // Prepare detailed results
    const detailedResults = answerSheet.answers.map((answer, index) => {
      const question = answerSheet.quiz.questions[index];
      return {
        question: question.question,
        type: question.type,
        userAnswer: answer.answer,
        correctAnswer: question.correctAnswer,
        isCorrect: answer.score > 0,
        points: answer.score,
        maxPoints: answer.maxScore,
        explanation: question.explanation
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          title: answerSheet.quiz.title,
          subject: answerSheet.quiz.subject,
          topic: answerSheet.quiz.topic
        },
        student: answerSheet.student,
        grading: answerSheet.grading,
        submission: answerSheet.submission,
        detailedResults,
        attempt: answerSheet.attempt
      }
    });

  } catch (error) {
    logger.error('Error fetching quiz results:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results'
    });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates.usage;
    delete updates.metadata;

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    logger.info(`Quiz updated: ${quiz._id}`);

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });

  } catch (error) {
    logger.error('Error updating quiz:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update quiz'
    });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByIdAndDelete(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Also delete associated answer sheets
    await AnswerSheet.deleteMany({ quiz: id });

    logger.info(`Quiz deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting quiz:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz'
    });
  }
};

// Get quiz statistics
const getQuizStats = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get answer sheet statistics
    const answerSheetStats = await AnswerSheet.aggregate([
      { $match: { quiz: quiz._id, status: 'graded' } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$grading.percentage' },
          highestScore: { $max: '$grading.percentage' },
          lowestScore: { $min: '$grading.percentage' },
          passedCount: {
            $sum: { $cond: ['$grading.passed', 1, 0] }
          }
        }
      }
    ]);

    const stats = answerSheetStats[0] || {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passedCount: 0
    };

    // Calculate pass rate
    stats.passRate = stats.totalAttempts > 0 ? 
      (stats.passedCount / stats.totalAttempts * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          title: quiz.title,
          totalQuestions: quiz.questions.length,
          totalPoints: quiz.totalPoints,
          difficulty: quiz.difficulty
        },
        statistics: stats
      }
    });

  } catch (error) {
    logger.error('Error fetching quiz stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz statistics'
    });
  }
};

module.exports = {
  generateQuiz,
  getQuizzes,
  getQuizById,
  startQuizAttempt,
  submitQuizAnswers,
  getQuizResults,
  updateQuiz,
  deleteQuiz,
  getQuizStats
};