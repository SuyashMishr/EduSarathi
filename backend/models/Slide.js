const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  slideNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  bulletPoints: [String],
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  layout: {
    type: String,
    enum: ['title', 'content', 'two_column', 'image_content', 'bullet_points', 'conclusion'],
    default: 'content'
  },
  notes: String, // Speaker notes
  animations: [{
    element: String,
    type: String,
    duration: Number
  }],
  backgroundColor: String,
  textColor: String
});

const slideDeckSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Slide deck title is required'],
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
  slides: [slideSchema],
  settings: {
    theme: {
      type: String,
      enum: ['default', 'modern', 'classic', 'minimal', 'colorful'],
      default: 'default'
    },
    template: {
      type: String,
      enum: ['education', 'business', 'creative', 'scientific'],
      default: 'education'
    },
    fontFamily: {
      type: String,
      default: 'Arial'
    },
    fontSize: {
      type: Number,
      default: 16
    },
    primaryColor: {
      type: String,
      default: '#007bff'
    },
    secondaryColor: {
      type: String,
      default: '#6c757d'
    }
  },
  duration: {
    estimated: Number, // in minutes
    actual: Number
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
    },
    totalSlides: {
      type: Number,
      default: 0
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
    presentations: {
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
    }
  },
  exports: [{
    format: {
      type: String,
      enum: ['pdf', 'pptx', 'html', 'images']
    },
    url: String,
    generatedAt: {
      type: Date,
      default: Date.now
    },
    size: Number
  }]
}, {
  timestamps: true
});

// Indexes
slideDeckSchema.index({ subject: 1, topic: 1 });
slideDeckSchema.index({ createdBy: 1 });
slideDeckSchema.index({ status: 1 });
slideDeckSchema.index({ tags: 1 });
slideDeckSchema.index({ 'sharing.isPublic': 1 });

// Pre-save middleware to update slide count
slideDeckSchema.pre('save', function(next) {
  if (this.slides) {
    this.metadata.totalSlides = this.slides.length;
  }
  next();
});

// Virtual for average rating
slideDeckSchema.virtual('averageRating').get(function() {
  if (this.usage.ratings.length === 0) return 0;
  const sum = this.usage.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.usage.ratings.length).toFixed(1);
});

// Method to add slide
slideDeckSchema.methods.addSlide = function(slideData) {
  const slideNumber = this.slides.length + 1;
  this.slides.push({
    slideNumber,
    ...slideData
  });
  return this.save();
};

// Method to reorder slides
slideDeckSchema.methods.reorderSlides = function(newOrder) {
  const reorderedSlides = newOrder.map((slideId, index) => {
    const slide = this.slides.id(slideId);
    if (slide) {
      slide.slideNumber = index + 1;
      return slide;
    }
  }).filter(Boolean);
  
  this.slides = reorderedSlides;
  return this.save();
};

// Method to duplicate slide
slideDeckSchema.methods.duplicateSlide = function(slideId) {
  const originalSlide = this.slides.id(slideId);
  if (originalSlide) {
    const duplicatedSlide = originalSlide.toObject();
    delete duplicatedSlide._id;
    duplicatedSlide.slideNumber = this.slides.length + 1;
    duplicatedSlide.title += ' (Copy)';
    
    this.slides.push(duplicatedSlide);
    return this.save();
  }
  throw new Error('Slide not found');
};

// Method to export slides
slideDeckSchema.methods.exportSlides = function(format) {
  // This would integrate with export service
  const exportData = {
    format,
    generatedAt: new Date(),
    // url and size would be set by export service
  };
  
  this.exports.push(exportData);
  return this.save();
};

// Method to increment views
slideDeckSchema.methods.incrementViews = function() {
  this.usage.views += 1;
  return this.save();
};

// Method to increment presentations
slideDeckSchema.methods.incrementPresentations = function() {
  this.usage.presentations += 1;
  return this.save();
};

// Method to add rating
slideDeckSchema.methods.addRating = function(userId, rating, comment) {
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

// Static method to get popular slides
slideDeckSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published', 'sharing.isPublic': true })
    .sort({ 'usage.views': -1, 'usage.ratings': -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

module.exports = mongoose.model('SlideDeck', slideDeckSchema);