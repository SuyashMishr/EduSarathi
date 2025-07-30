const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questionText: String,
  answer: String,
  answerImage: String, // Path to uploaded image
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  feedback: String,
  rubric: {
    criteria: [{
      name: String,
      score: Number,
      maxScore: Number,
      feedback: String
    }]
  },
  gradingStatus: {
    type: String,
    enum: ['pending', 'ai_graded', 'manually_graded', 'reviewed'],
    default: 'pending'
  }
});

const answerSheetSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [answerSchema],
  submission: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    timeTaken: Number, // in minutes
    ipAddress: String,
    userAgent: String
  },
  grading: {
    totalScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    },
    grade: String,
    passed: {
      type: Boolean,
      default: false
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date,
    gradingMethod: {
      type: String,
      enum: ['ai', 'manual', 'hybrid'],
      default: 'ai'
    }
  },
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'graded', 'reviewed'],
    default: 'in_progress'
  },
  attempt: {
    type: Number,
    default: 1
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  aiAnalysis: {
    confidence: Number,
    processingTime: Number,
    model: String,
    extractedText: String,
    detectedLanguage: String,
    qualityScore: Number
  },
  feedback: {
    overall: String,
    strengths: [String],
    improvements: [String],
    suggestions: [String]
  },
  flags: {
    needsReview: {
      type: Boolean,
      default: false
    },
    suspicious: {
      type: Boolean,
      default: false
    },
    technical_issues: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
answerSheetSchema.index({ student: 1, quiz: 1 });
answerSheetSchema.index({ status: 1 });
answerSheetSchema.index({ 'grading.gradedAt': 1 });
answerSheetSchema.index({ attempt: 1 });

// Pre-save middleware to calculate scores and percentages
answerSheetSchema.pre('save', function(next) {
  if (this.answers && this.answers.length > 0) {
    // Calculate total score
    this.grading.totalScore = this.answers.reduce((total, answer) => total + (answer.score || 0), 0);
    
    // Calculate percentage
    if (this.grading.maxScore > 0) {
      this.grading.percentage = (this.grading.totalScore / this.grading.maxScore) * 100;
    }
    
    // Determine if passed
    // Assuming passing score is stored in the quiz, we'll use a default of 60%
    this.grading.passed = this.grading.percentage >= 60;
    
    // Determine grade based on percentage
    if (this.grading.percentage >= 90) {
      this.grading.grade = 'A';
    } else if (this.grading.percentage >= 80) {
      this.grading.grade = 'B';
    } else if (this.grading.percentage >= 70) {
      this.grading.grade = 'C';
    } else if (this.grading.percentage >= 60) {
      this.grading.grade = 'D';
    } else {
      this.grading.grade = 'F';
    }
  }
  
  next();
});

// Method to add answer
answerSheetSchema.methods.addAnswer = function(questionId, answer, answerImage, maxScore) {
  this.answers.push({
    questionId,
    answer,
    answerImage,
    maxScore
  });
  return this.save();
};

// Method to update answer score
answerSheetSchema.methods.updateAnswerScore = function(answerId, score, feedback) {
  const answer = this.answers.id(answerId);
  if (answer) {
    answer.score = score;
    answer.feedback = feedback;
    answer.gradingStatus = 'ai_graded';
  }
  return this.save();
};

// Method to submit answer sheet
answerSheetSchema.methods.submit = function() {
  this.submission.endTime = new Date();
  this.submission.timeTaken = (this.submission.endTime - this.submission.startTime) / (1000 * 60); // in minutes
  this.status = 'submitted';
  return this.save();
};

// Method to complete grading
answerSheetSchema.methods.completeGrading = function(gradedBy, method = 'ai') {
  this.grading.gradedBy = gradedBy;
  this.grading.gradedAt = new Date();
  this.grading.gradingMethod = method;
  this.status = 'graded';
  return this.save();
};

// Static method to get student statistics
answerSheetSchema.statics.getStudentStats = function(studentId) {
  return this.aggregate([
    { $match: { student: mongoose.Types.ObjectId(studentId), status: 'graded' } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$grading.percentage' },
        highestScore: { $max: '$grading.percentage' },
        lowestScore: { $min: '$grading.percentage' },
        passedCount: {
          $sum: {
            $cond: ['$grading.passed', 1, 0]
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('AnswerSheet', answerSheetSchema);