const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ['root', 'main_topic', 'subtopic', 'detail', 'example', 'note'],
    default: 'subtopic'
  },
  level: {
    type: Number,
    default: 1
  },
  position: {
    x: Number,
    y: Number
  },
  style: {
    backgroundColor: String,
    textColor: String,
    borderColor: String,
    shape: {
      type: String,
      enum: ['rectangle', 'circle', 'ellipse', 'diamond', 'hexagon'],
      default: 'rectangle'
    },
    fontSize: Number,
    fontWeight: String
  },
  data: {
    content: String,
    resources: [String],
    examples: [String],
    keywords: [String]
  },
  metadata: {
    importance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    estimatedTime: Number // in minutes
  }
});

const edgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  label: String,
  type: {
    type: String,
    enum: ['hierarchy', 'association', 'dependency', 'sequence', 'similarity'],
    default: 'hierarchy'
  },
  style: {
    strokeColor: String,
    strokeWidth: Number,
    strokeStyle: {
      type: String,
      enum: ['solid', 'dashed', 'dotted'],
      default: 'solid'
    },
    arrowType: {
      type: String,
      enum: ['none', 'arrow', 'diamond', 'circle'],
      default: 'arrow'
    }
  },
  weight: {
    type: Number,
    default: 1
  }
});

const mindMapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Mind map title is required'],
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
  nodes: [nodeSchema],
  edges: [edgeSchema],
  layout: {
    type: {
      type: String,
      enum: ['hierarchical', 'radial', 'force', 'circular', 'tree'],
      default: 'hierarchical'
    },
    direction: {
      type: String,
      enum: ['top-bottom', 'bottom-top', 'left-right', 'right-left'],
      default: 'top-bottom'
    },
    spacing: {
      horizontal: {
        type: Number,
        default: 100
      },
      vertical: {
        type: Number,
        default: 80
      }
    }
  },
  style: {
    theme: {
      type: String,
      enum: ['default', 'colorful', 'minimal', 'dark', 'academic'],
      default: 'default'
    },
    fontFamily: {
      type: String,
      default: 'Arial'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    gridEnabled: {
      type: Boolean,
      default: false
    }
  },
  settings: {
    isInteractive: {
      type: Boolean,
      default: true
    },
    showLabels: {
      type: Boolean,
      default: true
    },
    allowEditing: {
      type: Boolean,
      default: true
    },
    autoLayout: {
      type: Boolean,
      default: true
    },
    zoomEnabled: {
      type: Boolean,
      default: true
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
    },
    totalNodes: {
      type: Number,
      default: 0
    },
    totalEdges: {
      type: Number,
      default: 0
    },
    complexity: {
      type: String,
      enum: ['simple', 'moderate', 'complex'],
      default: 'moderate'
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
    interactions: {
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
  exports: [{
    format: {
      type: String,
      enum: ['png', 'jpg', 'svg', 'pdf', 'json']
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
mindMapSchema.index({ subject: 1, topic: 1 });
mindMapSchema.index({ createdBy: 1 });
mindMapSchema.index({ status: 1 });
mindMapSchema.index({ tags: 1 });
mindMapSchema.index({ 'sharing.isPublic': 1 });

// Pre-save middleware to update counts
mindMapSchema.pre('save', function(next) {
  if (this.nodes) {
    this.metadata.totalNodes = this.nodes.length;
  }
  if (this.edges) {
    this.metadata.totalEdges = this.edges.length;
  }
  
  // Determine complexity based on node count
  if (this.metadata.totalNodes <= 10) {
    this.metadata.complexity = 'simple';
  } else if (this.metadata.totalNodes <= 25) {
    this.metadata.complexity = 'moderate';
  } else {
    this.metadata.complexity = 'complex';
  }
  
  next();
});

// Virtual for average rating
mindMapSchema.virtual('averageRating').get(function() {
  if (this.usage.ratings.length === 0) return 0;
  const sum = this.usage.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.usage.ratings.length).toFixed(1);
});

// Method to add node
mindMapSchema.methods.addNode = function(nodeData) {
  const nodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  this.nodes.push({
    id: nodeId,
    ...nodeData
  });
  return this.save();
};

// Method to add edge
mindMapSchema.methods.addEdge = function(source, target, edgeData = {}) {
  const edgeId = `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  this.edges.push({
    id: edgeId,
    source,
    target,
    ...edgeData
  });
  return this.save();
};

// Method to remove node and its edges
mindMapSchema.methods.removeNode = function(nodeId) {
  // Remove the node
  this.nodes = this.nodes.filter(node => node.id !== nodeId);
  
  // Remove all edges connected to this node
  this.edges = this.edges.filter(edge => 
    edge.source !== nodeId && edge.target !== nodeId
  );
  
  return this.save();
};

// Method to update node position
mindMapSchema.methods.updateNodePosition = function(nodeId, x, y) {
  const node = this.nodes.find(n => n.id === nodeId);
  if (node) {
    node.position = { x, y };
    return this.save();
  }
  throw new Error('Node not found');
};

// Method to get mind map structure for visualization
mindMapSchema.methods.getVisualizationData = function() {
  return {
    nodes: this.nodes.map(node => ({
      id: node.id,
      label: node.label,
      type: node.type,
      level: node.level,
      position: node.position,
      style: node.style,
      data: node.data
    })),
    edges: this.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: edge.type,
      style: edge.style
    })),
    layout: this.layout,
    style: this.style
  };
};

// Method to increment views
mindMapSchema.methods.incrementViews = function() {
  this.usage.views += 1;
  return this.save();
};

// Method to increment interactions
mindMapSchema.methods.incrementInteractions = function() {
  this.usage.interactions += 1;
  return this.save();
};

// Method to add rating
mindMapSchema.methods.addRating = function(userId, rating, comment) {
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

// Static method to get popular mind maps
mindMapSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published', 'sharing.isPublic': true })
    .sort({ 'usage.views': -1, 'usage.ratings': -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

module.exports = mongoose.model('MindMap', mindMapSchema);