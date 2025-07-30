const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Curriculum title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade level is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  learningObjectives: [{
    type: String,
    required: true
  }],
  topics: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    duration: String,
    subtopics: [String],
    resources: [String],
    activities: [String],
    assessments: [String]
  }],
  prerequisites: [String],
  resources: [{
    type: {
      type: String,
      enum: ['book', 'video', 'article', 'website', 'document'],
      required: true
    },
    title: String,
    url: String,
    description: String
  }],
  assessmentStrategy: {
    formative: [String],
    summative: [String],
    weightage: {
      assignments: Number,
      quizzes: Number,
      projects: Number,
      exams: Number
    }
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
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
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    ratings: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
curriculumSchema.index({ subject: 1, grade: 1 });
curriculumSchema.index({ createdBy: 1 });
curriculumSchema.index({ status: 1 });
curriculumSchema.index({ tags: 1 });
curriculumSchema.index({ 'usage.ratings.rating': 1 });

// Virtual for average rating
curriculumSchema.virtual('averageRating').get(function() {
  if (this.usage.ratings.length === 0) return 0;
  const sum = this.usage.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.usage.ratings.length).toFixed(1);
});

// Method to increment views
curriculumSchema.methods.incrementViews = function() {
  this.usage.views += 1;
  return this.save();
};

// Method to add rating
curriculumSchema.methods.addRating = function(userId, rating, comment) {
  // Remove existing rating from same user
  this.usage.ratings = this.usage.ratings.filter(r => !r.user.equals(userId));
  
  // Add new rating
  this.usage.ratings.push({
    user: userId,
    rating,
    comment
  });
  
  return this.save();
};

module.exports = mongoose.model('Curriculum', curriculumSchema);