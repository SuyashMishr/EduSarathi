const Curriculum = require('../models/Curriculum');
const logger = require('../utils/logger');
const axios = require('axios');

// Mock curriculum generator for testing when AI services are unavailable
const generateMockCurriculum = (subject, grade, duration, topics = [], learningObjectives = [], difficulty = 'intermediate') => {
  const mockCurricula = {
    Physics: {
      11: {
        title: `NCERT Physics Curriculum - Class ${grade}`,
        description: `Comprehensive Physics curriculum for Class ${grade} covering fundamental concepts in mechanics, thermodynamics, waves, and optics. Aligned with NCERT guidelines and designed to build strong conceptual understanding.`,
        learningObjectives: [
          'Understand the fundamental laws of physics and their applications',
          'Develop problem-solving skills in mechanics and thermodynamics',
          'Learn to analyze physical phenomena using mathematical tools',
          'Gain practical knowledge through experiments and demonstrations',
          'Prepare for competitive examinations and higher studies'
        ],
        topics: [
          {
            title: 'Physical World and Measurement',
            description: 'Introduction to physics, scope and excitement of physics, physics in relation to technology and society',
            duration: '2 weeks',
            subtopics: ['What is Physics?', 'Physics and Mathematics', 'Units and Measurements', 'Significant Figures'],
            resources: ['NCERT Textbook Chapter 1-2', 'Laboratory Manual', 'Online Simulations'],
            activities: ['Unit conversion exercises', 'Measurement experiments', 'Error analysis'],
            assessments: ['Unit test', 'Practical assessment', 'Problem-solving worksheets']
          },
          {
            title: 'Kinematics',
            description: 'Motion in a straight line, motion in a plane, projectile motion',
            duration: '3 weeks',
            subtopics: ['Position and Displacement', 'Velocity and Acceleration', 'Equations of Motion', 'Projectile Motion'],
            resources: ['NCERT Textbook Chapter 3-4', 'Video Lectures', 'Graphing Tools'],
            activities: ['Motion analysis experiments', 'Projectile motion lab', 'Graph plotting exercises'],
            assessments: ['Chapter test', 'Lab reports', 'Numerical problems']
          },
          {
            title: 'Laws of Motion',
            description: 'Newton\'s laws of motion, friction, circular motion',
            duration: '3 weeks',
            subtopics: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Friction', 'Circular Motion'],
            resources: ['NCERT Textbook Chapter 5', 'Demonstration Videos', 'Problem Sets'],
            activities: ['Force analysis experiments', 'Friction coefficient measurement', 'Circular motion demonstrations'],
            assessments: ['Conceptual tests', 'Problem-solving sessions', 'Lab practicals']
          },
          {
            title: 'Work, Energy and Power',
            description: 'Work-energy theorem, conservation of energy, power',
            duration: '2 weeks',
            subtopics: ['Work Done by a Force', 'Kinetic Energy', 'Potential Energy', 'Conservation of Energy', 'Power'],
            resources: ['NCERT Textbook Chapter 6', 'Energy Conservation Demos', 'Calculator Tools'],
            activities: ['Energy transformation experiments', 'Power calculation exercises', 'Conservation law verification'],
            assessments: ['Energy problems', 'Practical tests', 'Application-based questions']
          },
          {
            title: 'System of Particles and Rotational Motion',
            description: 'Centre of mass, rotational kinematics and dynamics',
            duration: '3 weeks',
            subtopics: ['Centre of Mass', 'Motion of Centre of Mass', 'Rotational Kinematics', 'Moment of Inertia', 'Torque'],
            resources: ['NCERT Textbook Chapter 7', 'Rotation Simulators', 'Mathematical Tools'],
            activities: ['Centre of mass experiments', 'Rotational motion analysis', 'Moment of inertia calculations'],
            assessments: ['Rotation problems', 'Lab assessments', 'Conceptual understanding tests']
          }
        ],
        prerequisites: [
          'Basic mathematics including algebra and trigonometry',
          'Understanding of coordinate geometry',
          'Familiarity with scientific notation',
          'Basic knowledge of vectors'
        ],
        resources: [
          {
            type: 'book',
            title: 'NCERT Physics Textbook Class 11',
            url: 'https://ncert.nic.in/textbook.php',
            description: 'Official NCERT textbook for Class 11 Physics'
          },
          {
            type: 'video',
            title: 'Khan Academy Physics',
            url: 'https://www.khanacademy.org/science/physics',
            description: 'Comprehensive video lectures on physics concepts'
          },
          {
            type: 'website',
            title: 'PhET Interactive Simulations',
            url: 'https://phet.colorado.edu/en/simulations/category/physics',
            description: 'Interactive physics simulations for better understanding'
          }
        ],
        assessmentStrategy: {
          formative: ['Daily quizzes', 'Lab reports', 'Homework assignments', 'Class participation'],
          summative: ['Unit tests', 'Mid-term examination', 'Final examination', 'Practical examination'],
          weightage: {
            assignments: 20,
            quizzes: 15,
            projects: 15,
            exams: 50
          }
        },
        tags: ['physics', 'class-11', 'ncert', 'mechanics', 'thermodynamics']
      }
    },
    Mathematics: {
      11: {
        title: `NCERT Mathematics Curriculum - Class ${grade}`,
        description: `Comprehensive Mathematics curriculum for Class ${grade} covering sets, functions, trigonometry, and coordinate geometry. Designed to build strong mathematical foundation.`,
        learningObjectives: [
          'Understand fundamental mathematical concepts and their applications',
          'Develop logical reasoning and problem-solving skills',
          'Master algebraic and geometric techniques',
          'Prepare for advanced mathematics and competitive examinations'
        ],
        topics: [
          {
            title: 'Sets and Functions',
            description: 'Introduction to sets, relations, and functions',
            duration: '3 weeks',
            subtopics: ['Sets and their Representations', 'Operations on Sets', 'Relations', 'Functions'],
            resources: ['NCERT Textbook Chapter 1-2', 'Practice Problems', 'Online Tools'],
            activities: ['Set theory exercises', 'Function graphing', 'Relation mapping'],
            assessments: ['Chapter tests', 'Problem-solving sessions', 'Application questions']
          }
        ],
        prerequisites: ['Class 10 Mathematics', 'Basic algebra', 'Coordinate geometry'],
        resources: [
          {
            type: 'book',
            title: 'NCERT Mathematics Textbook Class 11',
            url: 'https://ncert.nic.in/textbook.php',
            description: 'Official NCERT textbook for Class 11 Mathematics'
          }
        ],
        assessmentStrategy: {
          formative: ['Daily practice', 'Homework', 'Class tests'],
          summative: ['Unit tests', 'Board examinations'],
          weightage: { assignments: 25, quizzes: 25, projects: 0, exams: 50 }
        },
        tags: ['mathematics', 'class-11', 'ncert', 'algebra', 'geometry']
      }
    }
  };

  // Get subject-specific curriculum or create a generic one
  const subjectCurriculum = mockCurricula[subject]?.[grade];
  
  if (subjectCurriculum) {
    return {
      ...subjectCurriculum,
      duration,
      difficulty,
      model: 'mock-generator-v1.0',
      generationTime: Math.floor(Math.random() * 1000) + 500,
      // Override with provided topics and objectives if available
      ...(topics && topics.length > 0 && { topics: topics.map(topic => ({
        title: topic,
        description: `Comprehensive coverage of ${topic} concepts`,
        duration: '2-3 weeks',
        subtopics: [`Introduction to ${topic}`, `Advanced ${topic}`, `Applications of ${topic}`],
        resources: ['NCERT Textbook', 'Reference Materials', 'Online Resources'],
        activities: ['Theoretical Study', 'Problem Solving', 'Practical Applications'],
        assessments: ['Unit Test', 'Assignment', 'Project Work']
      })) }),
      ...(learningObjectives && learningObjectives.length > 0 && { learningObjectives })
    };
  }

  // Generic curriculum for other subjects
  return {
    title: `${subject} Curriculum - Class ${grade}`,
    description: `Comprehensive ${subject} curriculum for Class ${grade} designed according to educational standards and best practices.`,
    learningObjectives: learningObjectives.length > 0 ? learningObjectives : [
      `Understand fundamental concepts in ${subject}`,
      `Develop analytical and critical thinking skills`,
      `Apply knowledge to solve real-world problems`,
      `Prepare for higher education and competitive examinations`
    ],
    topics: topics.length > 0 ? topics.map(topic => ({
      title: topic,
      description: `Comprehensive study of ${topic}`,
      duration: '2-3 weeks',
      subtopics: [`Introduction to ${topic}`, `Core Concepts`, `Applications`],
      resources: ['Textbooks', 'Reference Materials', 'Digital Resources'],
      activities: ['Reading and Study', 'Problem Solving', 'Group Discussions'],
      assessments: ['Tests', 'Assignments', 'Projects']
    })) : [
      {
        title: `Introduction to ${subject}`,
        description: `Basic concepts and principles of ${subject}`,
        duration: '2 weeks',
        subtopics: ['Fundamentals', 'Key Concepts', 'Basic Applications'],
        resources: ['Standard Textbooks', 'Online Materials'],
        activities: ['Lectures', 'Discussions', 'Practice Exercises'],
        assessments: ['Quiz', 'Assignment', 'Test']
      }
    ],
    prerequisites: [`Previous grade ${subject}`, 'Basic mathematical skills', 'Reading comprehension'],
    resources: [
      {
        type: 'book',
        title: `Standard ${subject} Textbook`,
        description: `Recommended textbook for ${subject} Class ${grade}`
      }
    ],
    assessmentStrategy: {
      formative: ['Class participation', 'Homework', 'Quizzes'],
      summative: ['Unit tests', 'Projects', 'Final examination'],
      weightage: { assignments: 20, quizzes: 20, projects: 10, exams: 50 }
    },
    difficulty,
    duration,
    model: 'mock-generator-v1.0',
    generationTime: Math.floor(Math.random() * 1000) + 500,
    tags: [subject.toLowerCase(), `class-${grade}`, difficulty, 'curriculum']
  };
};

// Generate curriculum using AI
const generateCurriculum = async (req, res) => {
  try {
    const {
      subject,
      grade,
      duration,
      topics,
      learningObjectives,
      difficulty = 'intermediate',
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!subject || !grade || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Subject, grade, and duration are required'
      });
    }

    logger.info(`Generating curriculum for ${subject} - Grade ${grade}`);

    // Call Gemini AI service to generate curriculum (primary)
    let aiResponse;
    try {
      const geminiServiceUrl = process.env.GEMINI_SERVICE_URL || 'http://localhost:8001';
      aiResponse = await axios.post(`${geminiServiceUrl}/curriculum/generate`, {
        subject,
        grade: parseInt(grade),
        duration,
        focus_areas: topics || [],
        learningObjectives: learningObjectives || [],
        difficulty,
        language
      }, {
        timeout: parseInt(process.env.GEMINI_SERVICE_TIMEOUT) || 60000
      });
    } catch (geminiError) {
      logger.warn('Gemini service unavailable, falling back to legacy AI service:', geminiError.message);
      
      try {
        // Fallback to legacy AI service
        aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/curriculum/generate`, {
          subject,
          grade,
          duration,
          topics: topics || [],
          learningObjectives: learningObjectives || [],
          difficulty,
          language
        }, {
          timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 30000
        });
      } catch (legacyError) {
        logger.warn('Legacy AI service also unavailable, using mock curriculum:', legacyError.message);
        
        // Final fallback: Generate a mock curriculum for testing
        aiResponse = {
          data: {
            success: true,
            data: generateMockCurriculum(subject, grade, duration, topics, learningObjectives, difficulty)
          }
        };
      }
    }

    const generatedCurriculum = aiResponse.data.success ? aiResponse.data.data : aiResponse.data;

    // Create curriculum in database
    const curriculum = new Curriculum({
      title: generatedCurriculum.title || `${subject} Curriculum - Grade ${grade}`,
      subject,
      grade,
      duration,
      description: generatedCurriculum.description,
      learningObjectives: generatedCurriculum.learningObjectives || learningObjectives || [],
      topics: generatedCurriculum.topics || [],
      prerequisites: generatedCurriculum.prerequisites || [],
      resources: generatedCurriculum.resources || [],
      assessmentStrategy: generatedCurriculum.assessmentStrategy || {},
      difficulty,
      language,
      tags: generatedCurriculum.tags || [subject.toLowerCase(), grade.toLowerCase()],
      createdBy: req.user?.id || '000000000000000000000000', // Default user ID for demo
      metadata: {
        aiGenerated: true,
        model: generatedCurriculum.model || 'gpt-3.5-turbo',
        generationTime: generatedCurriculum.generationTime || 0
      }
    });

    const savedCurriculum = await curriculum.save();

    logger.info(`Curriculum generated successfully: ${savedCurriculum._id}`);

    res.status(201).json({
      success: true,
      message: 'Curriculum generated successfully',
      data: savedCurriculum
    });

  } catch (error) {
    logger.error('Error generating curriculum:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate curriculum',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all curricula
const getCurricula = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      grade,
      difficulty,
      status = 'published',
      search
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (subject) filter.subject = new RegExp(subject, 'i');
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
    
    const curricula = await Curriculum.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Curriculum.countDocuments(filter);
    
    const result = {
      docs: curricula,
      totalDocs: total,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    };

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Error fetching curricula:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch curricula'
    });
  }
};

// Get curriculum by ID
const getCurriculumById = async (req, res) => {
  try {
    const { id } = req.params;

    const curriculum = await Curriculum.findById(id)
      .populate('createdBy', 'name email')
      .populate('usage.ratings.user', 'name');

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Curriculum not found'
      });
    }

    // Increment views
    await curriculum.incrementViews();

    res.status(200).json({
      success: true,
      data: curriculum
    });

  } catch (error) {
    logger.error('Error fetching curriculum:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch curriculum'
    });
  }
};

// Update curriculum
const updateCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates.usage;
    delete updates.metadata;

    const curriculum = await Curriculum.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Curriculum not found'
      });
    }

    logger.info(`Curriculum updated: ${curriculum._id}`);

    res.status(200).json({
      success: true,
      message: 'Curriculum updated successfully',
      data: curriculum
    });

  } catch (error) {
    logger.error('Error updating curriculum:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update curriculum'
    });
  }
};

// Delete curriculum
const deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;

    const curriculum = await Curriculum.findByIdAndDelete(id);

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Curriculum not found'
      });
    }

    logger.info(`Curriculum deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Curriculum deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting curriculum:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete curriculum'
    });
  }
};

// Add rating to curriculum
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

    const curriculum = await Curriculum.findById(id);

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Curriculum not found'
      });
    }

    await curriculum.addRating(userId, rating, comment);

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: curriculum.averageRating,
        totalRatings: curriculum.usage.ratings.length
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

// Get popular curricula
const getPopularCurricula = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const curricula = await Curriculum.find({ 
      status: 'published' 
    })
    .sort({ 
      'usage.views': -1, 
      'usage.ratings': -1 
    })
    .limit(parseInt(limit))
    .populate('createdBy', 'name')
    .select('title subject grade difficulty averageRating usage.views createdAt');

    res.status(200).json({
      success: true,
      data: curricula
    });

  } catch (error) {
    logger.error('Error fetching popular curricula:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular curricula'
    });
  }
};

// Get curriculum statistics
const getCurriculumStats = async (req, res) => {
  try {
    const stats = await Curriculum.aggregate([
      {
        $group: {
          _id: null,
          totalCurricula: { $sum: 1 },
          publishedCurricula: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          totalViews: { $sum: '$usage.views' },
          averageRating: { $avg: { $avg: '$usage.ratings.rating' } }
        }
      }
    ]);

    const subjectStats = await Curriculum.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          averageRating: { $avg: { $avg: '$usage.ratings.rating' } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const gradeStats = await Curriculum.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalCurricula: 0,
          publishedCurricula: 0,
          totalViews: 0,
          averageRating: 0
        },
        bySubject: subjectStats,
        byGrade: gradeStats
      }
    });

  } catch (error) {
    logger.error('Error fetching curriculum stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch curriculum statistics'
    });
  }
};

module.exports = {
  generateCurriculum,
  getCurricula,
  getCurriculumById,
  updateCurriculum,
  deleteCurriculum,
  addRating,
  getPopularCurricula,
  getCurriculumStats
};