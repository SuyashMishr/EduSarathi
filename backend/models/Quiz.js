const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blank', 'matching'],
    required: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String,
  explanation: String,
  points: {
    type: Number,
    default: 1,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  media: {
    type: String, // URL to image/video
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio']
    }
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  grade: String,
  questions: [questionSchema],
  settings: {
    timeLimit: {
      type: Number, // in minutes
      default: 30
    },
    attemptsAllowed: {
      type: Number,
      default: 1
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    shuffleOptions: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: String,
      enum: ['immediately', 'after_submission', 'never'],
      default: 'after_submission'
    },
    passingScore: {
      type: Number,
      default: 60,
      min: 0,
      max: 100
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'medium'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  metadata: {
    aiGenerated: {
      type: Boolean,
      default: true
    },
    model: String,
    generationTime: Number,
    version: {
      type: String,
      default: '1.0'
    }
  },
  usage: {
    attempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    timezone: String
  }
}, {
  timestamps: true
});

// Indexes
quizSchema.index({ subject: 1, topic: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ status: 1 });
quizSchema.index({ tags: 1 });

// Pre-save middleware to calculate total points
quizSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  }
  next();
});

// Method to shuffle questions
quizSchema.methods.getShuffledQuestions = function() {
  if (!this.settings.shuffleQuestions) return this.questions;
  
  const shuffled = [...this.questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Method to get quiz for student (without correct answers)
quizSchema.methods.getStudentVersion = function() {
  const quiz = this.toObject();
  
  // Remove correct answers and explanations
  quiz.questions = quiz.questions.map(question => {
    const studentQuestion = { ...question };
    delete studentQuestion.correctAnswer;
    delete studentQuestion.explanation;
    
    if (question.options) {
      studentQuestion.options = question.options.map(option => ({
        text: option.text
      }));
    }
    
    return studentQuestion;
  });
  
  return quiz;
};

// Method to calculate score
quizSchema.methods.calculateScore = function(answers) {
  let totalScore = 0;
  let correctAnswers = 0;
  
  this.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    let isCorrect = false;
    
    switch (question.type) {
      case 'mcq':
      case 'true_false':
        isCorrect = userAnswer === question.correctAnswer;
        break;
      case 'short_answer':
      case 'fill_blank':
        isCorrect = userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        break;
      default:
        // For subjective questions, manual grading required
        isCorrect = false;
    }
    
    if (isCorrect) {
      totalScore += question.points;
      correctAnswers++;
    }
  });
  
  return {
    totalScore,
    maxScore: this.totalPoints,
    percentage: this.totalPoints > 0 ? (totalScore / this.totalPoints) * 100 : 0,
    correctAnswers,
    totalQuestions: this.questions.length,
    passed: this.totalPoints > 0 ? (totalScore / this.totalPoints) * 100 >= this.settings.passingScore : false
  };
};

module.exports = mongoose.model('Quiz', quizSchema);