const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ['introduction', 'explanation', 'demonstration', 'practice', 'discussion', 'assessment', 'summary'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  materials: [String],
  instructions: String,
  learningObjectives: [String],
  assessmentCriteria: [String],
  differentiation: {
    forAdvanced: String,
    forStruggling: String,
    forELL: String // English Language Learners
  },
  technology: [String],
  grouping: {
    type: String,
    enum: ['individual', 'pairs', 'small_groups', 'whole_class'],
    default: 'whole_class'
  }
});

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['textbook', 'video', 'website', 'document', 'image', 'audio', 'software', 'equipment'],
    required: true
  },
  url: String,
  description: String,
  required: {
    type: Boolean,
    default: false
  },
  alternatives: [String]
});

const assessmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['formative', 'summative', 'diagnostic'],
    required: true
  },
  method: {
    type: String,
    enum: ['observation', 'questioning', 'quiz', 'assignment', 'project', 'presentation', 'discussion'],
    required: true
  },
  description: String,
  criteria: [String],
  rubric: String,
  timing: {
    type: String,
    enum: ['beginning', 'during', 'end'],
    default: 'end'
  }
});

const lecturePlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lecture plan title is required'],
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
  grade: {
    type: String,
    required: [true, 'Grade level is required']
  },
  duration: {
    total: {
      type: Number, // in minutes
      required: true
    },
    breakdown: {
      introduction: Number,
      mainContent: Number,
      activities: Number,
      conclusion: Number
    }
  },
  learningObjectives: [{
    objective: {
      type: String,
      required: true
    },
    bloomsLevel: {
      type: String,
      enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
      required: true
    },
    measurable: {
      type: Boolean,
      default: true
    }
  }],
  prerequisites: [String],
  keyVocabulary: [{
    term: String,
    definition: String,
    example: String
  }],
  activities: [activitySchema],
  resources: [resourceSchema],
  assessments: [assessmentSchema],
  structure: {
    openingHook: {
      type: String,
      required: true
    },
    introduction: String,
    mainContent: [{
      section: String,
      content: String,
      duration: Number,
      teachingStrategy: String
    }],
    conclusion: String,
    homework: String,
    nextLesson: String
  },
  teachingStrategies: [{
    strategy: {
      type: String,
      enum: ['direct_instruction', 'inquiry_based', 'collaborative', 'problem_solving', 'discussion', 'demonstration', 'hands_on'],
      required: true
    },
    description: String,
    when: String
  }],
  differentiation: {
    content: String,
    process: String,
    product: String,
    environment: String
  },
  technology: [{
    tool: String,
    purpose: String,
    alternatives: [String]
  }],
  safety: {
    considerations: [String],
    equipment: [String],
    procedures: [String]
  },
  standards: [{
    framework: String, // e.g., "Common Core", "NGSS"
    code: String,
    description: String
  }],
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
    },
    totalActivities: {
      type: Number,
      default: 0
    },
    estimatedPreparationTime: Number // in minutes
  },
  usage: {
    implementations: {
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
      effectiveness: {
        type: Number,
        min: 1,
        max: 5
      },
      engagement: {
        type: Number,
        min: 1,
        max: 5
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    feedback: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      type: {
        type: String,
        enum: ['suggestion', 'improvement', 'issue', 'praise']
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareLink: String,
    allowDownload: {
      type: Boolean,
      default: true
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    collaborators: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permission: {
        type: String,
        enum: ['view', 'edit', 'admin'],
        default: 'view'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  implementation: {
    datesTaught: [Date],
    classSize: Number,
    actualDuration: Number,
    modifications: [String],
    outcomes: String,
    studentFeedback: String,
    teacherReflection: String
  }
}, {
  timestamps: true
});

// Indexes
lecturePlanSchema.index({ subject: 1, topic: 1, grade: 1 });
lecturePlanSchema.index({ createdBy: 1 });
lecturePlanSchema.index({ status: 1 });
lecturePlanSchema.index({ tags: 1 });
lecturePlanSchema.index({ 'sharing.isPublic': 1 });

// Pre-save middleware to update counts
lecturePlanSchema.pre('save', function(next) {
  if (this.activities) {
    this.metadata.totalActivities = this.activities.length;
    
    // Calculate estimated preparation time based on activities
    this.metadata.estimatedPreparationTime = this.activities.reduce((total, activity) => {
      return total + (activity.duration * 0.5); // Assume 30 seconds prep per minute of activity
    }, 0);
  }
  next();
});

// Virtual for average rating
lecturePlanSchema.virtual('averageRating').get(function() {
  if (this.usage.ratings.length === 0) return 0;
  const sum = this.usage.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.usage.ratings.length).toFixed(1);
});

// Virtual for total duration check
lecturePlanSchema.virtual('durationCheck').get(function() {
  const activityDuration = this.activities.reduce((total, activity) => total + activity.duration, 0);
  return {
    planned: this.duration.total,
    activities: activityDuration,
    difference: this.duration.total - activityDuration,
    isValid: Math.abs(this.duration.total - activityDuration) <= 5 // 5 minute tolerance
  };
});

// Method to add activity
lecturePlanSchema.methods.addActivity = function(activityData) {
  this.activities.push(activityData);
  return this.save();
};

// Method to reorder activities
lecturePlanSchema.methods.reorderActivities = function(newOrder) {
  const reorderedActivities = newOrder.map(activityId => {
    return this.activities.id(activityId);
  }).filter(Boolean);
  
  this.activities = reorderedActivities;
  return this.save();
};

// Method to add resource
lecturePlanSchema.methods.addResource = function(resourceData) {
  this.resources.push(resourceData);
  return this.save();
};

// Method to add assessment
lecturePlanSchema.methods.addAssessment = function(assessmentData) {
  this.assessments.push(assessmentData);
  return this.save();
};

// Method to record implementation
lecturePlanSchema.methods.recordImplementation = function(implementationData) {
  this.implementation.datesTaught.push(new Date());
  Object.assign(this.implementation, implementationData);
  this.usage.implementations += 1;
  return this.save();
};

// Method to add rating
lecturePlanSchema.methods.addRating = function(userId, ratingData) {
  // Remove existing rating from same user
  this.usage.ratings = this.usage.ratings.filter(r => !r.user.equals(userId));
  
  // Add new rating
  this.usage.ratings.push({
    user: userId,
    ...ratingData
  });
  
  return this.save();
};

// Method to add feedback
lecturePlanSchema.methods.addFeedback = function(userId, type, content) {
  this.usage.feedback.push({
    user: userId,
    type,
    content
  });
  return this.save();
};

// Method to get lesson plan summary
lecturePlanSchema.methods.getSummary = function() {
  return {
    title: this.title,
    subject: this.subject,
    topic: this.topic,
    grade: this.grade,
    duration: this.duration.total,
    objectivesCount: this.learningObjectives.length,
    activitiesCount: this.activities.length,
    resourcesCount: this.resources.length,
    assessmentsCount: this.assessments.length,
    averageRating: this.averageRating,
    implementations: this.usage.implementations
  };
};

// Static method to get popular lesson plans
lecturePlanSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published', 'sharing.isPublic': true })
    .sort({ 'usage.implementations': -1, 'usage.ratings': -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

// Static method to search by standards
lecturePlanSchema.statics.findByStandards = function(framework, codes) {
  return this.find({
    'standards.framework': framework,
    'standards.code': { $in: codes },
    status: 'published'
  });
};

module.exports = mongoose.model('LecturePlan', lecturePlanSchema);